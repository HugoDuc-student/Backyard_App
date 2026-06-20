import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Legend
} from 'recharts';
import { Card, SectionTitle, Label, ActionButton, SubmitButton, ProgressBar, EmptyState } from './UI';

const LOOP_DISTANCE = 6.706;

const SENSATIONS = [
  { val: 5, label: 'Excellent', color: '#2ECC71' },
  { val: 4, label: 'Bien', color: '#58D68D' },
  { val: 3, label: 'Moyen', color: '#F39C12' },
  { val: 2, label: 'Difficile', color: '#E67E22' },
  { val: 1, label: 'Très dur', color: '#E74C3C' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
      {payload.map(p => <div key={p.name} style={{ color: p.color }}>{p.name} : {p.value}</div>)}
    </div>
  );
};

export default function SuiviPrepa({ data, onSave, objectifs }) {
  const [sessions, setSessions] = useState(data?.sessions || []);
  const [kmGoal, setKmGoal] = useState(data?.kmGoal || '');
  const [form, setForm] = useState({ date: '', km: '', sensation: 3, note: '' });
  const [showForm, setShowForm] = useState(false);

  const totalKm = sessions.reduce((sum, s) => sum + Number(s.km), 0);
  const kmGoalNum = Number(kmGoal) || 0;

  // Objectif boucles → km cibles pendant la prépa
  const targetPrepKm = objectifs?.loopsRealistic
    ? Math.round(Number(objectifs.loopsRealistic) * LOOP_DISTANCE * 2.5)
    : null;

  const effectiveKmGoal = kmGoalNum || targetPrepKm || 0;

  const addSession = () => {
    if (!form.date || !form.km) return;
    const updated = [...sessions, { ...form, id: Date.now() }].sort((a, b) => new Date(a.date) - new Date(b.date));
    setSessions(updated);
    setForm({ date: '', km: '', sensation: 3, note: '' });
    setShowForm(false);
    onSave({ sessions: updated, kmGoal });
  };

  const removeSession = (id) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    onSave({ sessions: updated, kmGoal });
  };

  // Données graphique km cumulés
  let cumul = 0;
  const chartData = sessions.map(s => {
    cumul += Number(s.km);
    return {
      date: new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      'Km cumulés': Math.round(cumul * 10) / 10,
      'Objectif': effectiveKmGoal || undefined,
      sensation: s.sensation,
    };
  });

  // Données graphique sensations
  const sensationData = sessions.map(s => ({
    date: new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    'Sensation': s.sensation,
    'Km': Number(s.km),
  }));

  const sensationAvg = sessions.length
    ? (sessions.reduce((sum, s) => sum + Number(s.sensation), 0) / sessions.length).toFixed(1)
    : null;

  return (
    <div style={styles.section}>

      {/* OBJECTIF KM PRÉPA */}
      <SectionTitle>🎯 Objectif kilométrique prépa</SectionTitle>
      <Card>
        <Label sub={targetPrepKm ? `Suggestion basée sur ton objectif course : ${targetPrepKm} km` : 'Combien de km veux-tu courir avant la course ?'}>
          Objectif total de préparation
        </Label>
        <input
          type="number"
          placeholder={targetPrepKm ? `Suggestion : ${targetPrepKm} km` : 'ex. 500 km'}
          value={kmGoal}
          onChange={e => { setKmGoal(e.target.value); onSave({ sessions, kmGoal: e.target.value }); }}
        />
        {effectiveKmGoal > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13 }}>
              <span style={{ color: 'var(--gray-600)' }}>{Math.round(totalKm * 10) / 10} km effectués</span>
              <span style={{ fontWeight: 600, color: totalKm >= effectiveKmGoal ? 'var(--green)' : 'var(--accent)' }}>
                {Math.round((totalKm / effectiveKmGoal) * 100)}%
              </span>
            </div>
            <ProgressBar
              value={totalKm}
              max={effectiveKmGoal}
              color={totalKm >= effectiveKmGoal ? 'var(--green)' : 'var(--accent)'}
            />
            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>
              {totalKm >= effectiveKmGoal
                ? '✅ Objectif kilométrique atteint !'
                : `Il reste ${Math.round((effectiveKmGoal - totalKm) * 10) / 10} km à courir`}
            </div>
          </>
        )}
      </Card>

      {/* GRAPHIQUE KM CUMULÉS */}
      {chartData.length >= 2 && (
        <Card>
          <div style={styles.chartTitle}>Progression kilométrique</div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 12 }}>
            Km cumulés vs objectif de préparation
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
              <Tooltip content={<CustomTooltip />} />
              {effectiveKmGoal > 0 && <ReferenceLine y={effectiveKmGoal} stroke="var(--green)" strokeDasharray="5 5" label={{ value: 'Objectif', fontSize: 10, fill: 'var(--green)' }} />}
              <Line type="monotone" dataKey="Km cumulés" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* GRAPHIQUE SENSATIONS */}
      {sensationData.length >= 2 && (
        <Card>
          <div style={styles.chartTitle}>Sensations à l'entraînement</div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 12 }}>
            Moyenne : {sensationAvg}/5 · {sessions.length} séances
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={sensationData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
              <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={3} stroke="var(--amber)" strokeDasharray="4 4" />
              <Bar dataKey="Sensation" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* AJOUTER UNE SÉANCE */}
      <SectionTitle>📝 Ajouter une séance</SectionTitle>

      {showForm ? (
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <Label>Date</Label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <Label>Distance (km)</Label>
              <input type="number" placeholder="ex. 15" value={form.km} onChange={e => setForm(f => ({ ...f, km: e.target.value }))} />
            </div>
          </div>
          <Label sub="Comment s'est passée cette séance ?">Sensation globale</Label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {SENSATIONS.map(s => (
              <button
                key={s.val}
                onClick={() => setForm(f => ({ ...f, sensation: s.val }))}
                style={{
                  flex: 1, padding: '8px 4px', border: '1px solid', borderRadius: 8,
                  cursor: 'pointer', fontSize: 11, fontWeight: 500, fontFamily: 'var(--font)',
                  textAlign: 'center', transition: 'all 0.12s',
                  background: form.sensation === s.val ? s.color : 'transparent',
                  color: form.sensation === s.val ? '#fff' : 'var(--gray-600)',
                  borderColor: form.sensation === s.val ? s.color : 'var(--gray-200)',
                }}
              >{s.label}</button>
            ))}
          </div>
          <Label>Note libre</Label>
          <textarea
            rows={2}
            placeholder="ex. Bonne sortie longue, jambes légères. Travail en côtes efficace."
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            style={{ marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <SubmitButton onClick={addSession}>Ajouter la séance</SubmitButton>
            <ActionButton variant="ghost" onClick={() => setShowForm(false)}>Annuler</ActionButton>
          </div>
        </Card>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <ActionButton variant="ghost" onClick={() => setShowForm(true)}>+ Ajouter une séance</ActionButton>
        </div>
      )}

      {/* HISTORIQUE */}
      <SectionTitle>📋 Historique des séances</SectionTitle>
      {sessions.length === 0 && (
        <EmptyState icon="🏃" title="Aucune séance enregistrée" sub="Commence à tracker ta préparation" />
      )}
      {sessions.slice().reverse().map(s => {
        const sens = SENSATIONS.find(x => x.val === Number(s.sensation));
        return (
          <Card key={s.id} style={{ borderLeft: `3px solid ${sens?.color || 'var(--gray-200)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>
                  {new Date(s.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{s.km} km</span>
                  <span style={{ fontSize: 12, color: sens?.color, fontWeight: 500 }}>{sens?.label}</span>
                </div>
                {s.note && <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 6 }}>{s.note}</div>}
              </div>
              <ActionButton small variant="ghost" onClick={() => removeSession(s.id)}>✕</ActionButton>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

const styles = {
  section: { padding: '16px 16px 40px' },
  chartTitle: { fontSize: 14, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 4 },
};
