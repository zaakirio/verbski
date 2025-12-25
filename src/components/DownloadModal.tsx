import React from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import verbsData from '../assets/verbs.json';
import { pronounDisplay } from '../utils/constants';
import { Verb } from '../types';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const verbs: Verb[] = verbsData.verbs;

  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(verbsData, null, 2);
    triggerDownload(dataStr, 'verbski-verbs.json', 'application/json;charset=utf-8');
  };

  const downloadAnkiConjugation = () => {
    const lines: string[] = [];

    lines.push('#separator:tab');
    lines.push('#html:true');
    lines.push('#tags column:3');

    verbs.forEach((verb) => {
      const pronounKeys = Object.keys(verb.conjugations) as Array<keyof typeof verb.conjugations>;

      pronounKeys.forEach((key) => {
        const conjugation = verb.conjugations[key];
        const pronoun = pronounDisplay[key];
        const front = `<div class="conjugation">${conjugation}</div><div class="hint">${verb.infinitive} (${verb.english})</div>`;
        const back = `<div class="pronoun">${pronoun}</div>`;
        const tags = 'verbski russian-verbs';

        lines.push(`${front}\t${back}\t${tags}`);
      });
    });

    const content = lines.join('\n');
    triggerDownload(content, 'verbski-anki-conjugations.txt', 'text/plain;charset=utf-8');
  };

  const downloadAnkiInfinitive = () => {
    const lines: string[] = [];

    lines.push('#separator:tab');
    lines.push('#html:true');
    lines.push('#tags column:3');

    verbs.forEach((verb) => {
      const front = `<div class="infinitive">${verb.infinitive}</div><div class="english">${verb.english}</div>`;

      const conjugationRows = Object.entries(verb.conjugations)
        .map(([key, value]) => `<tr><td>${pronounDisplay[key]}</td><td>${value}</td></tr>`)
        .join('');

      const back = `<table class="conjugation-table">${conjugationRows}</table>`;
      const tags = 'verbski russian-verbs infinitive';

      lines.push(`${front}\t${back}\t${tags}`);
    });

    const content = lines.join('\n');
    triggerDownload(content, 'verbski-anki-infinitives.txt', 'text/plain;charset=utf-8');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content info-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-icon">
          <Download size={32} />
        </div>

        <h2>Download Verbs</h2>

        <div className="modal-body">
          <p>
            Export all {verbs.length} Russian verbs with their conjugations.
            Choose your preferred format below.
          </p>

          <div className="download-options">
            <div className="download-option">
              <div className="download-option-header">
                <FileJson size={24} />
                <h3>JSON Format</h3>
              </div>
              <p>Raw verb data with all conjugations. Perfect for developers or custom tools.</p>
              <button className="btn btn-secondary download-btn" onClick={downloadJSON}>
                <Download size={16} />
                Download JSON
              </button>
            </div>

            <div className="download-option">
              <div className="download-option-header">
                <FileText size={24} />
                <h3>Anki - Conjugation Cards</h3>
              </div>
              <p>
                {verbs.length * 6} flashcards matching the game: see a conjugation,
                guess the pronoun. Imports directly into Anki.
              </p>
              <button className="btn btn-secondary download-btn" onClick={downloadAnkiConjugation}>
                <Download size={16} />
                Download for Anki
              </button>
            </div>

            <div className="download-option">
              <div className="download-option-header">
                <FileText size={24} />
                <h3>Anki - Infinitive Cards</h3>
              </div>
              <p>
                {verbs.length} flashcards showing the infinitive on front,
                all conjugations on back. Great for memorizing full patterns.
              </p>
              <button className="btn btn-secondary download-btn" onClick={downloadAnkiInfinitive}>
                <Download size={16} />
                Download for Anki
              </button>
            </div>
          </div>

          <div className="anki-instructions">
            <h3>How to Import into Anki</h3>
            <ol>
              <li>Open Anki and select your deck (or create a new one)</li>
              <li>Go to <strong>File → Import</strong></li>
              <li>Select the downloaded .txt file</li>
              <li>Anki will auto-detect the format and import your cards</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
