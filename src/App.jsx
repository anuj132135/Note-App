import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { useForm } from "react-hook-form";

function App() {
  // Declare the useForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Delay in submitting form
  const delay = (d) => {
    return new Promise((resolve) => {
      setTimeout(resolve, d * 1000);
    });
  };

  // Declare the useState for data
  const [notes, setNotes] = useState([]);

  // Load existing notes from localStorage when the component mounts
  useEffect(() => {
    const storedNotes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const title = localStorage.key(i);
      const note = JSON.parse(localStorage.getItem(title));
      storedNotes.push({ id: Date.now() + i, title, content: note });
    }
    setNotes(storedNotes);
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    await delay(2);

    // Store the note in localStorage
    localStorage.setItem(data.title, JSON.stringify(data.note));

    // Update the notes state to include the new note
    const newNote = { id: Date.now(), title: data.title, content: data.note };
    setNotes([...notes, newNote]);

    // Reset the form after submission
    reset();
  };

  // Manipulating the DOM with a ref for showing form
  const addRef = useRef();

  // Use the useRef for showing form
  const addNote = () => {
    addRef.current.style.display = "block";
  };
  const cutForm = () => {
    addRef.current.style.display = "none";
  };

  // Handle card deletion
  const deleteCard = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);

    // Remove from localStorage
    const noteToDelete = notes.find((note) => note.id === id);
    localStorage.removeItem(noteToDelete.title);
  };

  return (
    <>
      <Header />
      <form ref={addRef} onSubmit={handleSubmit(onSubmit)}>
        <span className="cutform" onClick={cutForm}>
          &#10006;
        </span>
        <h2>Add Your Note</h2>
        <input
          type="text"
          placeholder="Your title..."
          {...register("title", { required: true })}
        />
        {errors.title && <p className="error">Title is required.</p>}
        <br />
        <textarea
          placeholder="Your Note..."
          {...register("note", { required: true })}
        ></textarea>
        {errors.note && <p className="error">Note is required.</p>}
        <br />
        <input type="submit" disabled={isSubmitting} />
        {isSubmitting && <h2>Loading...</h2>}
      </form>
      <main>
        <button className="add" onClick={addNote}>
          +
        </button>
        <div className="cards">
          {notes.map((note) => (
            <div className="card" key={note.id}>
              <h3>
                {note.title}
                <span onClick={() => deleteCard(note.id)}> &#10006;</span>
              </h3>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
