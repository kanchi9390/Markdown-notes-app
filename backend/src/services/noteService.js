const noteRepository = require('../repositories/noteRepository');
const { v4: uuidv4 } = require('uuid');

class NoteService {
  async getAllNotes() {
    return await noteRepository.findAll();
  }

  async getNoteById(id) {
    if (!this.isValidUUID(id)) {
      throw new Error('Invalid note ID format');
    }

    const note = await noteRepository.findById(id);
    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  }

  async createNote(title, content = '') {
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (title.length > 255) {
      throw new Error('Title must be less than 255 characters');
    }

    if (content && content.length > 1048576) { // 1MB limit
      throw new Error('Content must be less than 1MB');
    }

    return await noteRepository.create(title.trim(), content);
  }

  async updateNote(id, title, content) {
    if (!this.isValidUUID(id)) {
      throw new Error('Invalid note ID format');
    }

    if (!title || title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (title.length > 255) {
      throw new Error('Title must be less than 255 characters');
    }

    if (content && content.length > 1048576) { // 1MB limit
      throw new Error('Content must be less than 1MB');
    }

    const existingNote = await noteRepository.findById(id);
    if (!existingNote) {
      throw new Error('Note not found');
    }

    await noteRepository.update(id, title.trim(), content);

    return await noteRepository.findById(id);
  }

  async deleteNote(id) {
    if (!this.isValidUUID(id)) {
      throw new Error('Invalid note ID format');
    }

    const existingNote = await noteRepository.findById(id);
    if (!existingNote) {
      throw new Error('Note not found');
    }

    return await noteRepository.delete(id);
  }

  async searchNotes(searchTerm) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required');
    }

    return await noteRepository.search(searchTerm.trim());
  }


  async bulkDeleteNotes(noteIds) {
    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      throw new Error('Note IDs must be a non-empty array');
    }

    // Validate all UUIDs
    for (const id of noteIds) {
      if (!this.isValidUUID(id)) {
        throw new Error(`Invalid note ID format: ${id}`);
      }
    }

    return await noteRepository.bulkDelete(noteIds);
  }


  isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

module.exports = new NoteService();
