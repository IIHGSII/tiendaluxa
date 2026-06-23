'use client'

import { useState } from 'react';
import { createProduct, updateProduct, deleteProduct } from './actions';

export default function AdminPanel({ products }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: ''
  });

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: '', image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    if (editingId) {
      await updateProduct(editingId, data);
    } else {
      await createProduct(data);
    }
    handleCancel();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto de la tienda? Esta acción no se puede deshacer.')) {
      await deleteProduct(id);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Gestión de Productos</h1>
      
      <form onSubmit={handleSubmit} style={{ background: '#111', padding: '2rem', borderRadius: '12px', marginBottom: '3rem', display: 'grid', gap: '1.25rem' }}>
        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', color: '#d4af37' }}>
          {editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h3>
        
        {editingId && (
          <div>
            <label style={labelStyle}>ID del Producto (Solo lectura)</label>
            <input type="text" value={editingId} readOnly style={{ padding: '0.75rem', background: '#222', border: 'none', color: '#888', width: '100%', borderRadius: '4px' }} />
          </div>
        )}
        
        <div>
            <label style={labelStyle}>Nombre</label>
            <input name="name" placeholder="Ej. Bleu de Chanel" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} />
        </div>
        
        <div>
            <label style={labelStyle}>Precio (en Guaraníes)</label>
            <input name="price" type="number" placeholder="Ej. 1200000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={inputStyle} />
        </div>
        
        <div>
            <label style={labelStyle}>Categoría</label>
            <input name="category" placeholder="Ej. masculino, femenino, unisex, cuidado" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required style={inputStyle} />
        </div>

        <div>
            <label style={labelStyle}>URL de la Imagen</label>
            <input name="image" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required style={inputStyle} />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ padding: '1rem 2rem', fontWeight: 'bold' }}>
            {editingId ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn-outline" style={{ padding: '1rem 2rem' }}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      <div style={{ overflowX: 'auto', background: '#111', borderRadius: '12px', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Imagen</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No hay productos en la base de datos.</td></tr>
            )}
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={tdStyle}>{p.id}</td>
                <td style={tdStyle}>
                    <img src={p.image} alt={p.name} width="50" height="50" style={{ objectFit: 'cover', borderRadius: '6px' }} />
                </td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>
                    <span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{p.category}</span>
                </td>
                <td style={tdStyle}>{new Intl.NumberFormat('es-PY').format(p.price)} Gs.</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(p)} style={{ marginRight: '1rem', background: 'transparent', color: '#d4af37', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', color: '#ff4444', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = { padding: '1rem', borderRadius: '6px', background: '#222', border: '1px solid #333', color: 'white', width: '100%', fontSize: '1rem', marginTop: '0.25rem' };
const labelStyle = { color: '#aaa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const thStyle = { padding: '1rem', color: '#888', fontWeight: 'normal', textTransform: 'uppercase', fontSize: '0.8rem' };
const tdStyle = { padding: '1rem', verticalAlign: 'middle' };
