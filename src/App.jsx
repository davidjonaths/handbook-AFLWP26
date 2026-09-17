import { useState } from 'react'
import { ArrowRight, Check, ChevronLeft, Globe2, Lightbulb, RotateCcw, Sparkles, Trophy, X } from 'lucide-react'
import { questions } from './questions'

const letters = ['A', 'B', 'C', 'D']

function App() {
  const [screen, setScreen] = useState('welcome')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  const question = questions[questionIndex]
  const answered = selected !== null
  const progress = ((questionIndex + (answered ? 1 : 0)) / questions.length) * 100

  function chooseAnswer(index) {
    if (answered) return
    setSelected(index)
    if (index === question.answer) setScore((currentScore) => currentScore + 1)
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setScreen('results')
      return
    }
    setQuestionIndex((currentIndex) => currentIndex + 1)
    setSelected(null)
  }

  function restart() {
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setScreen('welcome')
  }

  if (screen === 'results') {
    return <Results score={score} onRestart={restart} />
  }

  if (screen === 'welcome') {
    return <Welcome onStart={() => setScreen('quiz')} />
  }

  return (
    <main className="quiz-shell">
      <header className="topbar">
        <button className="brand" onClick={restart} aria-label="Back to start">
          <span className="brand-mark"><Globe2 size={22} strokeWidth={2.5} /></span>
          <span>AIESEC <strong>in USU</strong></span>
        </button>
        <div className="topbar-meta">
          <span className="question-count">{String(questionIndex + 1).padStart(2, '0')} <small>/ 20</small></span>
          <span className="score-pill"><Sparkles size={14} /> {score} pts</span>
        </div>
      </header>

      <div className="progress-track" aria-label={`Question ${questionIndex + 1} of 20`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className="quiz-content">
        <div className="quiz-intro animate-in">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> {question.session}</p>
            <h1>Make an <em>impact.</em><br />One answer at a time.</h1>
          </div>
          <div className="swirl-note"><span>01</span><span>Discover<br />the world</span></div>
        </div>

        <div className="question-layout animate-in-delay">
          <div className="visual-card">
            <img src={question.image} alt={question.location} />
            <div className="visual-overlay" />
            <div className="image-caption"><span>{question.tag}</span><strong>{question.location}</strong></div>
            <div className="image-number">Q{String(questionIndex + 1).padStart(2, '0')}</div>
          </div>

          <div className="question-panel">
            <div className="question-heading">
              <span className="mini-label">Choose your answer</span>
              <h2>{question.title}</h2>
            </div>
            <div className="answers">
              {question.options.map((option, index) => {
                const isCorrect = index === question.answer
                const isSelected = selected === index
                const className = `answer ${answered && isCorrect ? 'correct' : ''} ${answered && isSelected && !isCorrect ? 'incorrect' : ''}`
                return (
                  <button key={option} className={className} onClick={() => chooseAnswer(index)} disabled={answered}>
                    <span className="answer-letter">{letters[index]}</span>
                    <span>{option}</span>
                    {answered && isCorrect && <Check className="answer-icon" size={18} />}
                    {answered && isSelected && !isCorrect && <X className="answer-icon" size={18} />}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className={`fact-box ${selected === question.answer ? 'fact-correct' : 'fact-wrong'}`}>
                <div className="fact-icon">{selected === question.answer ? <Check size={18} /> : <Lightbulb size={18} />}</div>
                <div><strong>{selected === question.answer ? 'That is right!' : `The answer is ${letters[question.answer]}.`}</strong><p>{question.fact}</p></div>
              </div>
            )}
            <div className="question-actions">
              <button className="quiet-button" onClick={restart}><ChevronLeft size={16} /> Exit quiz</button>
              <button className="next-button" onClick={nextQuestion} disabled={!answered}>{questionIndex === questions.length - 1 ? 'See my result' : 'Next question'} <ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </section>
      <footer className="quiz-footer"><span>AIESEC Future Leaders Winter Peak / 2026</span><span>Powered by young people who care.</span></footer>
    </main>
  )
}

function Welcome({ onStart }) {
  return (
    <main className="welcome-page">
      <nav className="welcome-nav"><div className="brand"><span className="brand-mark"><Globe2 size={22} strokeWidth={2.5} /></span><span>AIESEC <strong>in USU</strong></span></div><span className="nav-chip">AIESEC Future Leaders / 2026</span></nav>
      <section className="welcome-hero">
        <div className="hero-copy animate-in">
          <p className="eyebrow"><span className="eyebrow-dot" /> A world of questions awaits</p>
          <h1>How much of the<br /><em>world</em> do you carry?</h1>
          <p className="hero-subtitle">A playful journey through people, places, and the Sustainable Development Goals. Get curious. Get inspired. Make your next move count.</p>
          <button className="start-button" onClick={onStart}>Start the journey <ArrowRight size={20} /></button>
          <div className="hero-details"><span><strong>20</strong> questions</span><span className="detail-divider" /><span><strong>04</strong> chapters</span><span className="detail-divider" /><span><strong>∞</strong> impact</span></div>
        </div>
        <div className="hero-art animate-in-delay">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="sun-card"><span className="sun-card-top">AIESEC / 1948</span><Globe2 size={150} strokeWidth={0.7} /><span className="sun-card-bottom">CONNECTING<br />THE WORLD</span></div>
          <div className="floating-note note-top">CURIOUS<br /><strong>MINDS</strong></div>
          <div className="floating-note note-bottom"><span>01</span> Be open to<br />a new perspective.</div>
        </div>
      </section>
      <div className="welcome-footer"><span>LEARN / LEAD / IMPACT</span><span>Scroll less. Explore more. <span className="arrow-down">↓</span></span></div>
    </main>
  )
}

function Results({ score, onRestart }) {
  const percentage = Math.round((score / questions.length) * 100)
  const message = percentage >= 80 ? 'You see the bigger picture.' : percentage >= 50 ? 'Your curiosity is already moving.' : 'Every journey starts with one question.'
  return (
    <main className="results-page">
      <nav className="welcome-nav"><div className="brand"><span className="brand-mark"><Globe2 size={22} strokeWidth={2.5} /></span><span>AIESEC <strong>in USU</strong></span></div><button className="restart-link" onClick={onRestart}><RotateCcw size={16} /> Play again</button></nav>
      <section className="results-content animate-in">
        <div className="result-kicker"><Trophy size={18} /> Your journey so far</div>
        <div className="score-ring"><div><strong>{score}</strong><span>out of 20</span></div></div>
        <p className="eyebrow"><span className="eyebrow-dot" /> {percentage}% correct</p>
        <h1>{message}</h1>
        <p className="results-copy">The world is bigger, brighter, and more connected because people like you choose to stay curious.</p>
        <button className="start-button" onClick={onRestart}>Take it from the top <RotateCcw size={19} /></button>
      </section>
      <div className="results-stamp"><span>KEEP<br />EXPLORING</span><Globe2 size={42} /></div>
    </main>
  )
}

export default App
