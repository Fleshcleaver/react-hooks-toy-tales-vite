import React, { useState, useEffect } from 'react';

// ToyCard Component
function ToyCard({ toy, onDelete, onLike }) {
  return (
    <div data-testid="toy-card" style={{ border: '1px solid #ccc', padding: '16px', margin: '8px', borderRadius: '8px' }}>
      <h2>{toy.name}</h2>
      <img src={toy.image} alt={toy.name} style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
      <p>{toy.likes} Likes </p>
      <button onClick={() => onLike(toy)}>Like &lt;3</button>
      <button onClick={() => onDelete(toy.id)} style={{ marginLeft: '8px' }}>Donate to GoodWill</button>
    </div>
  );
}

// ToyForm Component
function ToyForm({ onAddToy }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = () => {
    onAddToy({ name, image });
    setName('');
    setImage('');
  };

  return (
    <div style={{ margin: '16px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Create a toy!</h3>
      <input
        type="text"
        placeholder="Enter a toy's name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', margin: '8px 0', padding: '8px', width: '300px' }}
      />
      <input
        type="text"
        placeholder="Enter a toy's image URL..."
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={{ display: 'block', margin: '8px 0', padding: '8px', width: '300px' }}
      />
      <button onClick={handleSubmit} style={{ marginTop: '8px', padding: '8px 16px' }}>Create New Toy</button>
    </div>
  );
}

// ToyContainer Component
function ToyContainer({ toys, onDelete, onLike }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {toys.map(toy => (
        <ToyCard key={toy.id} toy={toy} onDelete={onDelete} onLike={onLike} />
      ))}
    </div>
  );
}

// Main App Component
export default function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/toys')
      .then(res => res.json())
      .then(data => setToys(data));
  }, []);

  const handleAddToy = (newToyData) => {
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...newToyData, likes: 0 })
    })
      .then(res => res.json())
      .then(newToy => {
        setToys([...toys, newToy]);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setToys(toys.filter(toy => toy.id !== id));
      });
  };

  const handleLike = (toy) => {
    const updatedToy = { ...toy, likes: toy.likes + 1 };
    
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: updatedToy.likes })
    })
      .then(res => res.json())
      .then(returnedToy => {
        setToys(toys.map(t => t.id === returnedToy.id ? returnedToy : t));
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Andy's Toy Collection</h1>
      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '16px', padding: '8px 16px' }}>
        Add a Toy
      </button>
      {showForm && <ToyForm onAddToy={handleAddToy} />}
      <ToyContainer toys={toys} onDelete={handleDelete} onLike={handleLike} />
    </div>
  );
}