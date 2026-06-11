from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, get_db
from .models import Ticket, Note
from .schemas import TicketCreate, TicketUpdate

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Customer Support API Running"}


# CREATE TICKET
@app.post("/api/tickets")
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):

    count = db.query(Ticket).count() + 1

    ticket_id = f"TKT-{count:03}"

    new_ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status="Open"
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return {
        "ticket_id": new_ticket.ticket_id,
        "created_at": new_ticket.created_at
    }


# LIST + SEARCH + FILTER
@app.get("/api/tickets")
def get_tickets(
    status: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):

    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        query = query.filter(
            or_(
                Ticket.ticket_id.contains(search),
                Ticket.customer_name.contains(search),
                Ticket.customer_email.contains(search),
                Ticket.subject.contains(search),
                Ticket.description.contains(search)
            )
        )

    tickets = query.order_by(Ticket.created_at.desc()).all()

    return tickets


# GET SINGLE TICKET
@app.get("/api/tickets/{ticket_id}")
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    notes = db.query(Note).filter(
        Note.ticket_id == ticket_id
    ).all()

    return {
        "ticket": ticket,
        "notes": notes
    }


# UPDATE TICKET
@app.put("/api/tickets/{ticket_id}")
def update_ticket(
    ticket_id: str,
    update: TicketUpdate,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    ticket.status = update.status
    ticket.updated_at = datetime.utcnow()

    if update.note:

        note = Note(
            ticket_id=ticket_id,
            note_text=update.note
        )

        db.add(note)

    db.commit()

    return {
        "success": True,
        "updated_at": ticket.updated_at
    }
    
@app.delete("/api/tickets/{ticket_id}")
def delete_ticket(ticket_id: str, db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    notes = db.query(Note).filter(
        Note.ticket_id == ticket_id
    ).all()

    for note in notes:
        db.delete(note)

    db.delete(ticket)

    db.commit()

    return {
        "success": True,
        "message": "Ticket deleted successfully"
    }