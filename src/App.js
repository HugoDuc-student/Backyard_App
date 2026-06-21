import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import Objectifs from './components/Objectifs';
import ProfilMental from './components/ProfilMental';
import SuiviPrepa from './components/SuiviPrepa';

// ID fixe du client — une seule personne utilise cette app
const CLIENT_ID = 'thomas';

export default function App() {
  const [tab, setTab] = useState('objectifs');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Chargement initial depuis Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, 'clients', CLIENT_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (e) {
        console.error('Erreur chargement:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sauvegarde sur Firebase
  const save = async (key, val) => {
    const updated = { ...data, [key]: val };
    setData(updated);
    setSaving(true);
    try {
      await setDoc(doc(db, 'clients', CLIENT_ID), updated);
    } catch (e) {
      console.error('Erreur sauvegarde:', e);
    } finally {
      setSaving(false);
    }
  };

  const daysLeft = data.objectifs?.raceDate
    ? Math.ceil((new Date(data.objectifs.raceDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const tabs = [
    { id: 'objectifs', label: 'Objectifs', icon: '🎯' },
    { id: 'profil', label: 'Profil', icon: '💪' },
    { id: 'suivi', label: 'Suivi', icon: '📊' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 32 }}>🏃</div>
        <div style={{ fontSize: 14, color: 'var(--gray-400)' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.logo}>Backyard Ultra</div>
            <div style={styles.logoSub}>Préparation mentale · Thomas</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {daysLeft !== null && daysLeft > 0 && (
              <div style={styles.countdown}>
                <div style={styles.countdownNum}>J−{daysLeft}</div>
                <div style={styles.countdownLabel}>avant la course</div>
              </div>
            )}
            {saving && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Sauvegarde...</div>}
          </div>
        </div>
        <nav style={styles.nav}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...styles.navBtn,
                background: tab === t.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderColor: tab === t.id ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === 'objectifs' && (
          <Objectifs data={data.objectifs} onSave={val => save('objectifs', val)} />
        )}
        {tab === 'profil' && (
          <ProfilMental data={data.profil} onSave={val => save('profil', val)} />
        )}
        {tab === 'suivi' && (
          <SuiviPrepa data={data.suivi} onSave={val => save('suivi', val)} objectifs={data.objectifs} />
        )}
      </main>
    </div>
  );
}

const styles = {
  app: { maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: 'var(--gray-50)' },
  header: {
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)',
    padding: '16px 16px 12px',
    position: 'sticky', top: 0, zIndex: 100,
  },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  logo: { fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' },
  logoSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  countdown: { textAlign: 'right' },
  countdownNum: { fontSize: 22, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' },
  countdownLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  nav: { display: 'flex', gap: 6 },
  navBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '9px 6px', border: '1px solid', borderRadius: 'var(--radius-sm)',
    fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font)',
    color: '#fff', transition: 'all 0.15s',
  },
};
