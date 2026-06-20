import React, { useState } from 'react';
import { Card, SectionTitle, Label, ActionButton, SubmitButton, Badge, EmptyState } from './UI';

const CATEGORIES = ['Physique', 'Mental', 'Technique', 'Nutrition', 'Logistique'];

function ItemForm({ onAdd, type }) {
  const [text, setText] = useState('');
  const [cat, setCat] = useState('Mental');
  const [action, setAction] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({ text, category: cat, action: type === 'weakness' ? action : null, id: Date.now() });
    setText('');
    setAction('');
  };

  return (
    <Card style={{ background: 'var(--gray-50)', border: '1px dashed var(--gray-200)' }}>
      <Label>{type === 'strength' ? 'Nouvelle force' : 'Nouvelle faiblesse'}</Label>
      <input
        type="text"
        placeholder={type === 'strength' ? 'ex. Bonne gestion de l\'effort en montée' : 'ex. Peur du noir'}
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              border: '1px solid', fontFamily: 'var(--font)',
              background: cat === c ? (type === 'strength' ? 'var(--green)' : 'var(--accent)') : 'transparent',
              color: cat === c ? '#fff' : 'var(--gray-600)',
              borderColor: cat === c ? (type === 'strength' ? 'var(--green)' : 'var(--accent)') : 'var(--gray-200)',
            }}
          >{c}</button>
        ))}
      </div>
      {type === 'weakness' && (
        <>
          <Label sub="Comment tu vas travailler cette faiblesse d'ici la course ?">Plan d'action</Label>
          <textarea
            rows={2}
            placeholder="ex. S'entraîner 2x par mois la nuit pour apprivoiser l'obscurité"
            value={action}
            onChange={e => setAction(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        </>
      )}
      <ActionButton onClick={handleAdd} variant="primary" small>
        + Ajouter
      </ActionButton>
    </Card>
  );
}

function ItemCard({ item, onDelete, type }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card style={{ borderLeft: `3px solid ${type === 'strength' ? 'var(--green)' : 'var(--accent)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Badge color={type === 'strength' ? 'green' : 'red'}>{item.category}</Badge>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{item.text}</div>
          {item.action && (
            <div
              style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 6, cursor: 'pointer' }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '▾' : '▸'} Plan d'action
            </div>
          )}
          {expanded && item.action && (
            <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 4, padding: '8px 10px', background: 'var(--gray-50)', borderRadius: 6 }}>
              {item.action}
            </div>
          )}
        </div>
        <ActionButton small variant="ghost" onClick={() => onDelete(item.id)}>✕</ActionButton>
      </div>
    </Card>
  );
}

export default function ProfilMental({ data, onSave }) {
  const [strengths, setStrengths] = useState(data?.strengths || []);
  const [weaknesses, setWeaknesses] = useState(data?.weaknesses || []);
  const [showStrengthForm, setShowStrengthForm] = useState(false);
  const [showWeaknessForm, setShowWeaknessForm] = useState(false);

  const addStrength = (item) => { setStrengths(s => [...s, item]); setShowStrengthForm(false); };
  const addWeakness = (item) => { setWeaknesses(w => [...w, item]); setShowWeaknessForm(false); };
  const removeStrength = (id) => setStrengths(s => s.filter(x => x.id !== id));
  const removeWeakness = (id) => setWeaknesses(w => w.filter(x => x.id !== id));

  const withAction = weaknesses.filter(w => w.action && w.action.trim()).length;

  return (
    <div style={styles.section}>

      {/* RÉSUMÉ */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--green)' }}>{strengths.length}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Forces identifiées</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--accent)' }}>{weaknesses.length}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Faiblesses identifiées</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--amber)' }}>{withAction}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Plans d'action</div>
          </div>
        </div>
      )}

      {/* FORCES */}
      <SectionTitle>💪 Mes forces</SectionTitle>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
        Ce sur quoi tu peux t'appuyer pendant la course. Identifie-les pour y revenir dans les moments difficiles.
      </div>

      {strengths.length === 0 && !showStrengthForm && (
        <EmptyState icon="💪" title="Aucune force listée" sub="Identifie ce que tu fais bien — physique, mental, technique..." />
      )}
      {strengths.map(s => <ItemCard key={s.id} item={s} type="strength" onDelete={removeStrength} />)}
      {showStrengthForm
        ? <ItemForm type="strength" onAdd={addStrength} />
        : <div style={{ marginBottom: 12 }}><ActionButton variant="ghost" onClick={() => setShowStrengthForm(true)}>+ Ajouter une force</ActionButton></div>
      }

      {/* FAIBLESSES */}
      <SectionTitle>⚠️ Mes faiblesses</SectionTitle>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
        Ce qui peut te freiner. Nommer une faiblesse, c'est déjà commencer à la travailler.
      </div>

      {weaknesses.length === 0 && !showWeaknessForm && (
        <EmptyState icon="⚠️" title="Aucune faiblesse listée" sub="Identifie ce que tu veux travailler d'ici la course" />
      )}
      {weaknesses.map(w => <ItemCard key={w.id} item={w} type="weakness" onDelete={removeWeakness} />)}
      {showWeaknessForm
        ? <ItemForm type="weakness" onAdd={addWeakness} />
        : <div style={{ marginBottom: 12 }}><ActionButton variant="ghost" onClick={() => setShowWeaknessForm(true)}>+ Ajouter une faiblesse</ActionButton></div>
      }

      <SubmitButton onClick={() => onSave({ strengths, weaknesses })}>Sauvegarder mon profil</SubmitButton>
    </div>
  );
}

const styles = {
  section: { padding: '16px 16px 40px' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 },
  summaryCard: { background: '#fff', border: '1px solid var(--gray-100)', borderRadius: 'var(--radius-md)', padding: '14px 12px', textAlign: 'center' },
};
