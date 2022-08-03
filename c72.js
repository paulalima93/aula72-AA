//função para pegar as informações dos livros do bando de dados

getBookDetails = bookId => {
    bookId = bookId.trim();
    db.collection("books").where("book_id", "==", bookId).get().then(snapshot => {
        snapshot.docs.map(doc => {
          this.setState({
            bookName: doc.data().book_name
          });
        });
      });
  };


//função para pegar as informações dos alunos do bando de dados
  getStudentDetails = studentId => {
    studentId = studentId.trim();
    db.collection("students").where("student_id", "==", studentId).get().then(snapshot => {
        snapshot.docs.map(doc => {
          this.setState({
            studentName: doc.data().student_name
          });
        });
      });
  };
  
  
  //corpo da função para retirar ou devolver o livro. dependendo do tipo de transação, alterar o necessário
  
  initiateBook_TRANSACTION = async (bookId, studentId, bookName, studentName) => {
    console.log("Livro ___________ pelo aluno!");

    //adicionar uma transação
    db.collection("transactions").add({
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: firebase.firestore.Timestamp.now().toDate(),
      transaction_type: //se for retirado, será "issue", se for devolução será "return"
    });
    // alterar status do livro
    db.collection("books")
      .doc(bookId)
      .update({
        is_book_available: //se o aluno estiver retirando o livro, será falso, se estiver devolvendo, será true
      });
    // alterar o número de livros retirados pelo aluno
    db.collection("students")
      .doc(studentId)
      .update({
        number_of_books_issued: firebase.firestore.FieldValue.increment(0)
        //o valor entre parenteses será 1 em caso de retirada, e -1 em caso de devolução
      });

    // atualizando estado local
    this.setState({
      bookId: "",
      studentId: ""
    });

  }
