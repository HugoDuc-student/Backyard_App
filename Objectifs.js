import React, { useState } from 'react';
import { Card, SectionTitle, Label, SubmitButton, Badge, ActionButton } from './UI';

const LOOP_DISTANCE = 6.706; // km par boucle Backyard Ultra

export default function Objectifs({ data, onSave }) {
  const [form, setForm] = useState(data || {
    // Objectif résultat
    loopsRealistic: '',
    loopsDream: '',
    raceDate: '',
    // Objectif performance
    targetLoopTime: '',
    acceptedDecline: '',
    // Objectif processus
    sensations: '',
    processGoals: ['', '', ''],
    // Plan d'action
    actionPlan: '',
    // Intentions
    ifThen: [''],
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const updateProcessGoal = (i, val) => {
    const arr = [...form.processGoals];
    arr[i] = val;
    set('processGoals', arr);
  };

  const updateIfThen = (i, val) => {
    const arr = [...form.ifThen];
    arr[i] = val;
    set('ifThen', arr);
  };

  const addIfThen = () => set('ifThen', [...form.ifThen, '']);
  const removeIfThen = (i) => set('ifThen', form.ifThen.filter((_, idx) => idx !== i));

  const realisticKm = form.loopsRealistic ? (Number(form.loopsRealistic) * LOOP_DISTANCE).toFixed(1) : null;
  const dreamKm = form.loopsDream ? (Number(form.loopsDream) * LOOP_DISTANCE).toFixed(1) : null;

  const getDaysUntilRace = () => {
    if (!form.raceDate) return null;
    const diff = new Date(form.raceDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const daysLeft = getDaysUntilRace();

  return (
    <div style={styles.section}>

      {/* OBJECTIF RÉSULTAT */}
      <SectionTitle>🎯 Objectif résultat</SectionTitle>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
        Ce que tu vises comme nombre de boucles. La distinction réaliste / rêve t'aide à rester ancré tout en maintenant de l'ambition.
      </div>

      <Card>
        <Label sub="Boucle de 6,706 km — combien penses-tu pouvoir réaliser ?">Objectif réaliste</Label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="number" placeholder="ex. 40" value={form.loopsRealistic} onChange={e => set('loopsRealistic', e.target.value)} style={{ flex: 1 }} />
          {realisticKm && <Badge color="green">≈ {realisticKm} km</Badge>}
        </div>
      </Card>

      <Card>
        <Label sub="Dans tes rêves les plus fous — sans te mettre de pression">Objectif dans mes rêves</Label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="number" placeholder="ex. 60" value={form.loopsDream} onChange={e => set('loopsDream', e.target.value)} style={{ flex: 1 }} />
          {dreamKm && <Badge color="amber">≈ {dreamKm} km</Badge>}
        </div>
      </Card>

      <Card>
        <Label sub="La date de la course">Date de la course</Label>
        <input type="date" value={form.raceDate} onChange={e => set('raceDate', e.target.value)} />
        {daysLeft !== null && daysLeft > 0 && (
          <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, marginTop: 8 }}>
            J−{daysLeft} avant la course
          </div>
        )}
      </Card>

      {/* OBJECTIF PERFORMANCE */}
      <SectionTitle>⏱ Objectif performance</SectionTitle>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
        Ce que tu vises comme allure et comment tu acceptes de décliner au fil des boucles.
      </div>

      <Card>
        <Label sub="Temps cible pour les premières boucles (en minutes)">Temps par boucle cible</Label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="number" placeholder="ex. 55 min" value={form.targetLoopTime} onChange={e => set('targetLoopTime', e.target.value)} style={{ flex: 1 }} />
          {form.targetLoopTime && <Badge color="gray">{(LOOP_DISTANCE / (Number(form.targetLoopTime) / 60)).toFixed(2)} km/h</Badge>}
        </div>
      </Card>

      <Card>
        <Label sub="De combien de minutes accepts-tu de ralentir par boucle en moyenne ?">Déclin accepté par boucle</Label>
        <input type="number" placeholder="ex. 2 min par boucle" value={form.acceptedDecline} onChange={e => set('acceptedDecline', e.target.value)} />
        {form.targetLoopTime && form.acceptedDecline && form.loopsRealistic && (
          <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 6 }}>Projection temps sur les dernières boucles</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              Boucle {form.loopsRealistic} estimée à {Number(form.targetLoopTime) + Number(form.acceptedDecline) * Number(form.loopsRealistic)} min
            </div>
          </div>
        )}
      </Card>

      {/* OBJECTIF PROCESSUS */}
      <SectionTitle>⚙️ Objectif processus</SectionTitle>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
        Ce que tu contrôles totalement — indépendamment du résultat. C'est souvent là que se gagne une course longue.
      </div>

      <Card>
        <Label sub="3 choses que tu peux contrôler et t'engages à faire pendant la course">Mes engagements processus</Label>
        {form.processGoals.map((g, i) => (
          <input
            key={i}
            type="text"
            placeholder={['ex. Manger à chaque ravitaillement', 'ex. Courir à conversation le premier tiers', 'ex. Sourire aux bénévoles'][i]}
            value={g}
            onChange={e => updateProcessGoal(i, e.target.value)}
            style={{ marginBottom: i < 2 ? 8 : 0 }}
          />
        ))}
      </Card>

      <Card>
        <Label sub="Les sensations que tu veux ressentir pendant cette course — pas la performance, le vécu">Sensations cibles</Label>
        <textarea
          rows={3}
          placeholder="ex. Me sentir fort dans les descentes, ressentir la solidarité avec les autres coureurs, avoir l'impression de maîtriser mon effort..."
          value={form.sensations}
          onChange={e => set('sensations', e.target.value)}
        />
      </Card>

      {/* PLAN SI-ALORS */}
      <SectionTitle>🔄 Plans Si–Alors</SectionTitle>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 12 }}>
        Anticipe les moments difficiles. Pour chaque obstacle probable, prépare une réponse automatique. Ex : "Si j'ai envie d'abandonner à la boucle 20, alors je me dis que j'ai préparé ce moment."
      </div>

      {form.ifThen.map((item, i) => (
        <Card key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Label>Scénario {i + 1}</Label>
            {form.ifThen.length > 1 && (
              <ActionButton small variant="danger" onClick={() => removeIfThen(i)}>Supprimer</ActionButton>
            )}
          </div>
          <textarea
            rows={2}
            placeholder="Si [obstacle]... alors [ma réponse]..."
            value={item}
            onChange={e => updateIfThen(i, e.target.value)}
          />
        </Card>
      ))}
      <div style={{ marginBottom: 12 }}>
        <ActionButton variant="ghost" onClick={addIfThen}>+ Ajouter un scénario</ActionButton>
      </div>

      <SubmitButton onClick={() => onSave(form)}>Sauvegarder mes objectifs</SubmitButton>
    </div>
  );
}

const styles = {
  section: { padding: '16px 16px 40px' },
};
