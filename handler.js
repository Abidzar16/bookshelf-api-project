const { nanoid } = require('nanoid');
var book = require('./books');

const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  if(name == null || name == ""){
    const response = h.response({
      status: 'fail',
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if(readPage > pageCount){
    const response = h.response({
      status: 'fail',
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  book.push(newBook);
  const isSuccess = book.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  
  response.code(500);
  return response;
};

const getAllBooksHandler = (request,h) => {
  var { reading, finished, name } = request.query || null;
  var book1 = Object.assign([], book);

  if (name != undefined){
    book1 = book1.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading != undefined){
    book1 = book1.filter(item => item.reading == reading);
  }
  if (finished != undefined){
    book1 = book1.filter(item => item.finished == finished);
  }

  const books = book1.map(item => ({ id: item.id, name: item.name, publisher: item.publisher}));

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const book_id = book.filter((n) => n.id === id)[0];
 
 if (book_id !== undefined) {
    return {
      status: 'success',
      data: {
        book : book_id,
      },
    };
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = book.findIndex((book) => book.id === id);

  if(readPage > pageCount){
    const response = h.response({
      status: 'fail',
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  if(name == null){
    const response = h.response({
      status: 'fail',
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }
 
  if (index !== -1) {
    book[index] = {
      ...book[index],
      name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };
 
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const index = book.findIndex((emlt) => emlt.id === id);
 
  if (index !== -1) {
    book.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
    
  };
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}
 
module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };