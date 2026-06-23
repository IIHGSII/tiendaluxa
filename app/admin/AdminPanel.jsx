'use client'

import { useState, useRef, useCallback } from 'react';
import { createProduct, updateProduct, deleteProduct, bulkUpsertProducts } from './actions';

// ─── Estilos locales ─────────────────────────────────────────────
const inputStyle = {
  padding: '1rem',
  borderRadius: '6px',
  background: '#222',
  border: '1px solid #333',
  color: 'white',
  width: '100%',
  fontSize: '1rem',
  marginTop: '0.25rem',
};
const labelStyle = {
  color: '#aaa',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};
const thStyle = {
  padding: '1rem',
  color: '#888',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  fontSize: '0.8rem',
};
const tdStyle = { padding: '1rem', verticalAlign: 'middle' };

// ─── PASO 1: Subida de archivo ────────────────────────────────────
function ExcelImporter({ onImportComplete }) {
  const fileInputRef = useRef(null);
  const [step, setStep] = useState('idle'); // idle | preview | importing | done | error
  const [dragging, setDragging] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Detectar columnas de forma flexible
  const detectColumns = (header) => {
    const find = (keywords) =>
      header.findIndex((h) =>
        keywords.some((k) => String(h).toLowerCase().includes(k))
      );
    return {
      codigoIdx: find(['codigo', 'código', 'code', 'cod']),
      nombreIdx: find(['producto', 'nombre', 'name', 'descripcion', 'descripción']),
      precioIdx: find(['precio', 'price', 'importe', 'valor']),
    };
  };

  const processFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setErrorMsg('');

    try {
      // Cargar xlsx de forma dinámica (client-side only)
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const raw = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      if (!raw || raw.length < 2) {
        setErrorMsg('El archivo parece estar vacío o no tiene datos.');
        return;
      }

      const header = raw[0];
      const { codigoIdx, nombreIdx, precioIdx } = detectColumns(header);

      if (codigoIdx === -1 && nombreIdx === -1) {
        setErrorMsg(
          `No se encontraron las columnas esperadas. Encabezados detectados: ${header.join(', ')}`
        );
        return;
      }

      const rows = [];
      for (let i = 1; i < raw.length; i++) {
        const row = raw[i];
        const codigo =
          codigoIdx >= 0 ? String(row[codigoIdx] ?? '').trim() : '';
        const nombre =
          nombreIdx >= 0 ? String(row[nombreIdx] ?? '').trim() : '';
        const precioRaw =
          precioIdx >= 0 ? row[precioIdx] : '';
        const precio = precioRaw !== '' ? Number(String(precioRaw).replace(/[^0-9.,-]/g, '').replace(',', '.')) : 0;

        if (!codigo && !nombre) continue; // saltar filas vacías

        rows.push({
          codigo_item_proveedor: codigo,
          name: nombre,
          price: isNaN(precio) ? 0 : Math.round(precio),
        });
      }

      if (rows.length === 0) {
        setErrorMsg('No se encontraron filas con datos válidos.');
        return;
      }

      setParsedRows(rows);
      setStep('preview');
    } catch (err) {
      setErrorMsg(`Error al procesar el archivo: ${err.message}`);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) return;
    setStep('importing');
    setProgress(0);

    const BATCH = 100;
    let totalUpdated = 0;
    let totalCreated = 0;
    const allErrors = [];

    for (let i = 0; i < parsedRows.length; i += BATCH) {
      const batch = parsedRows.slice(i, i + BATCH);
      const res = await bulkUpsertProducts(batch);
      totalUpdated += res.updated || 0;
      totalCreated += res.created || 0;
      if (res.errors?.length) allErrors.push(...res.errors);
      setProgress(Math.round(((i + batch.length) / parsedRows.length) * 100));
    }

    setResult({ updated: totalUpdated, created: totalCreated, errors: allErrors });
    setStep('done');
    if (onImportComplete) onImportComplete();
  };

  const handleReset = () => {
    setStep('idle');
    setParsedRows([]);
    setFileName('');
    setProgress(0);
    setResult(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── UI ──────────────────────────────────────────────────────────

  if (step === 'idle' || step === 'error') {
    return (
      <div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#d4af37' : '#444'}`,
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(212,175,55,0.06)' : '#0a0a0a',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ color: '#aaa', margin: 0, fontSize: '1rem' }}>
            Arrastrá tu archivo Excel acá
          </p>
          <p style={{ color: '#555', margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
            o hacé clic para seleccionar (.xlsx, .xls)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
        {errorMsg && (
          <div style={{
            marginTop: '1rem',
            background: 'rgba(220,50,50,0.12)',
            border: '1px solid #aa3333',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            color: '#ff7777',
            fontSize: '0.9rem',
          }}>
            ⚠️ {errorMsg}
          </div>
        )}
      </div>
    );
  }

  if (step === 'preview') {
    const sampleRows = parsedRows.slice(0, 5);
    return (
      <div>
        {/* Encabezado de vista previa */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Total de filas', value: parsedRows.length, color: '#d4af37' },
            { label: 'Archivo', value: fileName, color: '#aaa' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: '#0a0a0a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '0.75rem 1.25rem',
              flex: '1',
              minWidth: '180px',
            }}>
              <div style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              <div style={{ color, fontSize: '1.1rem', fontWeight: 'bold', marginTop: '0.25rem', wordBreak: 'break-all' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Primeras 5 filas de muestra */}
        <div style={{ overflowX: 'auto', background: '#0a0a0a', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #222' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                {['Código Proveedor', 'Nombre', 'Precio'].map(h => (
                  <th key={h} style={{ ...thStyle, textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ ...tdStyle, color: '#d4af37', fontFamily: 'monospace' }}>{r.codigo_item_proveedor || '—'}</td>
                  <td style={tdStyle}>{r.name || '—'}</td>
                  <td style={{ ...tdStyle, color: '#88cc88' }}>
                    {r.price ? new Intl.NumberFormat('es-PY').format(r.price) + ' Gs.' : '—'}
                  </td>
                </tr>
              ))}
              {parsedRows.length > 5 && (
                <tr>
                  <td colSpan={3} style={{ ...tdStyle, color: '#555', fontStyle: 'italic', textAlign: 'center' }}>
                    ... y {parsedRows.length - 5} filas más
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleImport}
            className="btn-primary"
            style={{ padding: '0.85rem 2rem', background: '#d4af37', borderColor: '#d4af37', color: '#000', fontWeight: 'bold' }}
          >
            ✓ Confirmar e Importar ({parsedRows.length} productos)
          </button>
          <button
            onClick={handleReset}
            className="btn-outline"
            style={{ padding: '0.85rem 1.5rem', color: '#aaa', borderColor: '#444' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (step === 'importing') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
          Importando productos... {progress}%
        </p>
        <div style={{
          background: '#1a1a1a',
          borderRadius: '999px',
          height: '10px',
          overflow: 'hidden',
          border: '1px solid #333',
        }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #a07840, #d4af37)',
              borderRadius: '999px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.75rem' }}>
          No cierres esta ventana
        </p>
      </div>
    );
  }

  if (step === 'done' && result) {
    return (
      <div>
        <div style={{
          background: 'rgba(40,180,100,0.08)',
          border: '1px solid #2a6640',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>✅ Importación completada</div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Actualizados</span>
              <div style={{ color: '#d4af37', fontSize: '1.8rem', fontWeight: 'bold' }}>{result.updated}</div>
            </div>
            <div>
              <span style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Creados</span>
              <div style={{ color: '#6dbf7e', fontSize: '1.8rem', fontWeight: 'bold' }}>{result.created}</div>
            </div>
            {result.errors.length > 0 && (
              <div>
                <span style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Errores</span>
                <div style={{ color: '#ff7777', fontSize: '1.8rem', fontWeight: 'bold' }}>{result.errors.length}</div>
              </div>
            )}
          </div>
          {result.errors.length > 0 && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ color: '#ff7777', cursor: 'pointer', fontSize: '0.85rem' }}>
                Ver errores
              </summary>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                {result.errors.slice(0, 20).map((e, i) => (
                  <li key={i} style={{ color: '#ff9999', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{e}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
        <button
          onClick={handleReset}
          className="btn-outline"
          style={{ padding: '0.75rem 1.5rem', color: '#aaa', borderColor: '#444' }}
        >
          Importar otro archivo
        </button>
      </div>
    );
  }

  return null;
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function AdminPanel({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState(null);
  const [showImporter, setShowImporter] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
  });

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
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

      {/* ── Importador Excel ─────────────────────────────────── */}
      <div style={{
        background: '#111',
        borderRadius: '12px',
        marginBottom: '2.5rem',
        border: '1px solid #2a2a2a',
        overflow: 'hidden',
      }}>
        {/* Cabecera del importador */}
        <button
          onClick={() => setShowImporter(v => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderBottom: showImporter ? '1px solid #2a2a2a' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📥</span>
            <span style={{ fontWeight: 600, fontSize: '1rem' }}>Importar desde Excel</span>
            <span style={{
              background: '#d4af3722',
              color: '#d4af37',
              border: '1px solid #d4af3744',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Carga masiva
            </span>
          </div>
          <span style={{ color: '#555', fontSize: '1.2rem', transition: 'transform 0.2s', transform: showImporter ? 'rotate(180deg)' : 'none' }}>
            ▾
          </span>
        </button>

        {showImporter && (
          <div style={{ padding: '1.75rem' }}>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Subí el archivo Excel de tu proveedor. Se detectarán automáticamente las columnas{' '}
              <strong style={{ color: '#aaa' }}>Codigo</strong>,{' '}
              <strong style={{ color: '#aaa' }}>Producto</strong> y{' '}
              <strong style={{ color: '#aaa' }}>Precio</strong>. Los productos existentes (por código)
              se actualizarán; los nuevos serán creados.
            </p>
            <ExcelImporter onImportComplete={() => {}} />
          </div>
        )}
      </div>

      {/* ── Formulario Crear / Editar ──────────────────────── */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#111',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '3rem',
          display: 'grid',
          gap: '1.25rem',
        }}
      >
        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', color: '#d4af37' }}>
          {editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h3>

        {editingId && (
          <div>
            <label style={labelStyle}>ID del Producto (Solo lectura)</label>
            <input
              type="text"
              value={editingId}
              readOnly
              style={{ padding: '0.75rem', background: '#222', border: 'none', color: '#888', width: '100%', borderRadius: '4px' }}
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>Nombre</label>
          <input
            name="name"
            placeholder="Ej. Bleu de Chanel"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Precio (en Guaraníes)</label>
          <input
            name="price"
            type="number"
            placeholder="Ej. 1200000"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Categoría</label>
          <input
            name="category"
            placeholder="Ej. masculino, femenino, unisex, cuidado"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>URL de la Imagen</label>
          <input
            name="image"
            placeholder="https://..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
            style={inputStyle}
          />
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

      {/* ── Tabla de Productos ─────────────────────────────── */}
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
            {initialProducts.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  No hay productos en la base de datos.
                </td>
              </tr>
            )}
            {initialProducts.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={tdStyle}>{p.id}</td>
                <td style={tdStyle}>
                  <img
                    src={p.image || 'https://placehold.co/50x50/111/333?text=—'}
                    alt={p.name}
                    width="50"
                    height="50"
                    style={{ objectFit: 'cover', borderRadius: '6px' }}
                  />
                </td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>
                  <span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {p.category || '—'}
                  </span>
                </td>
                <td style={tdStyle}>{new Intl.NumberFormat('es-PY').format(p.price)} Gs.</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(p)}
                    style={{ marginRight: '1rem', background: 'transparent', color: '#d4af37', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ background: 'transparent', color: '#ff4444', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
