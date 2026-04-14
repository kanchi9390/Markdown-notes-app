const noteService = require('../services/noteService');

class NoteController {
  async getAllNotes(req, res) {
    try {
      const notes = await noteService.getAllNotes();

      res.json({
        success: true,
        data: notes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        }
      });
    }
  }

  async getNoteById(req, res) {
    try {
      const { id } = req.params;
      const note = await noteService.getNoteById(id);

      res.json({
        success: true,
        data: note
      });
    } catch (error) {
      if (error.message === 'Note not found') {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Note not found'
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }
    }
  }

  async createNote(req, res) {
    try {
      const { title, content } = req.body;
      const note = await noteService.createNote(title, content);

      res.status(201).json({
        success: true,
        data: note
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        }
      });
    }
  }

  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const note = await noteService.updateNote(id, title, content);

      res.json({
        success: true,
        data: note
      });
    } catch (error) {
      if (error.message === 'Note not found') {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Note not found'
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }
    }
  }

  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      await noteService.deleteNote(id);

      res.json({
        success: true,
        message: 'Note deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Note not found') {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Note not found'
          }
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }
    }
  }

  async searchNotes(req, res) {
    try {
      const { q: searchTerm } = req.query;

      const notes = await noteService.searchNotes(searchTerm);

      res.json({
        success: true,
        data: notes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        }
      });
    }
  }

  async bulkDeleteNotes(req, res) {
    try {
      const { noteIds } = req.body;

      if (!Array.isArray(noteIds) || noteIds.length === 0) {
        throw new Error('Note IDs must be a non-empty array');
      }

      const result = await noteService.bulkDeleteNotes(noteIds);

      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} note${result.deletedCount > 1 ? 's' : ''}`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message
        }
      });
    }
  }

}

module.exports = new NoteController();
