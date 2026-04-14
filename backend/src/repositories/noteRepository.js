const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class NoteRepository {
  async findAll() {
    const [notes] = await pool.query(
      `SELECT id, title, content, created_at, updated_at
       FROM notes
       ORDER BY updated_at DESC`
    );

    return notes;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, title, content, created_at, updated_at
       FROM notes
       WHERE id = ?`,
      [id]
    );

    return rows[0];
  }


  async create(title, content = '') {
    const id = uuidv4();

    const [result] = await pool.query(
      `INSERT INTO notes (id, title, content)
       VALUES (?, ?, ?)`,
      [id, title, content]
    );

    return this.findById(id);
  }

  async update(id, title, content) {
    await pool.query(
      `UPDATE notes
       SET title = ?, content = ?
       WHERE id = ?`,
      [title, content, id]
    );

    return this.findById(id);
  }

  async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM notes WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  async search(searchTerm) {
    const searchPattern = `%${searchTerm}%`;


    const [notes] = await pool.query(
      `SELECT id, title, content, created_at, updated_at
       FROM notes
       WHERE title LIKE ? OR content LIKE ?
       ORDER BY 
         CASE 
           WHEN title LIKE ? THEN 1 
           ELSE 2 
         END,
         updated_at DESC`,
      [searchPattern, searchPattern, searchPattern]
    );


    return notes;
  }


  async bulkDelete(noteIds) {
    if (noteIds.length === 0) {
      return { deletedCount: 0 };
    }

    const placeholders = noteIds.map(() => '?').join(',');

    const [result] = await pool.query(
      `DELETE FROM notes WHERE id IN (${placeholders})`,
      noteIds
    );

    return { deletedCount: result.affectedRows };
  }

}

module.exports = new NoteRepository();
