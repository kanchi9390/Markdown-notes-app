const express = require('express');
const noteController = require('../controllers/noteController');
const { validateNote, validateUUID, validateSearch, validateBulkDelete } = require('../middleware/validation');

const router = express.Router();

// GET /api/notes - Get all notes
router.get('/', noteController.getAllNotes);

// GET /api/notes/search - Search notes
router.get('/search', validateSearch, noteController.searchNotes);

// GET /api/notes/:id - Get single note
router.get('/:id', validateUUID, noteController.getNoteById);

// POST /api/notes - Create new note
router.post('/', validateNote, noteController.createNote);

// PUT /api/notes/update/:id - Update note
router.put('/update/:id', validateUUID, validateNote, noteController.updateNote);

// DELETE /api/notes/bulkDelete - Bulk delete notes
router.delete('/bulkDelete', validateBulkDelete, noteController.bulkDeleteNotes);

// DELETE /api/notes/delete/:id - Delete note
router.delete('/delete/:id', validateUUID, noteController.deleteNote);


module.exports = router;
