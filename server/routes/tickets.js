import express from 'express';
import { handleError } from '../utils/errorHandler.js';
import { useTicketStore } from '../../src/store/ticketStore.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const tickets = useTicketStore.getState().tickets;
    res.json(tickets);
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/', (req, res) => {
  try {
    const addTicket = useTicketStore.getState().addTicket;
    const ticket = addTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    handleError(error, res);
  }
});

router.put('/:id', (req, res) => {
  try {
    const updateTicket = useTicketStore.getState().updateTicket;
    updateTicket(req.params.id, req.body);
    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    handleError(error, res);
  }
});

router.delete('/:id', (req, res) => {
  try {
    const deleteTicket = useTicketStore.getState().deleteTicket;
    deleteTicket(req.params.id);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    handleError(error, res);
  }
});

export const ticketsRouter = router;