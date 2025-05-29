"use client"

import { useState, useEffect } from "react"

interface GameState {
  currentMoney: number
  currentDecision: number
  gamePhase: "intro" | "tutorial" | "playing" | "revealing" | "result" | "leaderboard"
  decisions: Array<{
    option: string
    invested: number
    result: "win" | "lose"
    gained: number
  }>
}

interface LeaderboardEntry {
  name: string
  finalAmount: number
  profile: string
  date: string
  id: string
}

interface ProgressRevealProps {
  isRevealing: boolean
  result: "win" | "lose"
  onComplete: () => void
  winChance: number
  investment: number
  potentialGain: number
  onContinue: () => void
}

const baseDecisions = [
  {
    title: "Decisión 1: Tu Inversión Inicial",
    subtitle: "¿Qué estrategia de compra elegís?",
    scenario:
      "⚽ Tenés $1000 para arrancar tu emprendimiento de figuritas del Mundial. ¿Cómo invertís tu plata?",
    icon: "🏪",
    options: [
      {
        id: "A",
        title: "Paquetes Comunes",
        description: "Figuritas regulares. Casi seguro que recuperás la inversión",
        investment: 150,
        winChance: 90,
        winGain: 350,
        riskLevel: "low" as const,
        icon: "📦",
      },
      {
        id: "B",
        title: "Mix Equilibrado",
        description: "Mitad comunes, mitad especiales. Riesgo moderado",
        investment: 250,
        winChance: 65,
        winGain: 650,
        riskLevel: "medium" as const,
        icon: "⚖️",
      },
      {
        id: "C",
        title: "Figuritas Raras",
        description: "¡A por la dorada de Messi! Pocas chances, pero si sale...",
        investment: 350,
        winChance: 25,
        winGain: 1200,
        riskLevel: "high" as const,
        icon: "⭐",
      },
    ],
  },
  {
    title: "Decisión 2: Estrategia de Venta",
    subtitle: "¿Dónde vendés tus figuritas?",
    scenario:
      "💼 Ya tenés tu stock de figuritas. Ahora decidí dónde y cómo las vas a vender:",
    icon: "💰",
    options: [
      {
        id: "A",
        title: "En el Barrio",
        description: "Venta directa a vecinos y conocidos. Seguro pero limitado",
        investment: 100,
        winChance: 85,
        winGain: 300,
        riskLevel: "low" as const,
        icon: "🏘️",
      },
      {
        id: "B",
        title: "En la Escuela",
        description: "Punto estratégico con muchos clientes potenciales",
        investment: 200,
        winChance: 60,
        winGain: 550,
        riskLevel: "medium" as const,
        icon: "🎒",
      },
      {
        id: "C",
        title: "Online y Redes",
        description: "Instagram, TikTok, MercadoLibre. Alcance máximo",
        investment: 300,
        winChance: 35,
        winGain: 900,
        riskLevel: "high" as const,
        icon: "📱",
      },
    ],
  },
  {
    title: "Decisión 3: Expansión del Negocio",
    subtitle: "¿Cómo hacés crecer tu emprendimiento?",
    scenario:
      "🚀 Tu negocio de figuritas va bien. Es hora de expandir. ¿Cuál es tu próximo paso?",
    icon: "📈",
    options: [
      {
        id: "A",
        title: "Más Figuritas",
        description: "Seguir con lo que funciona. Comprar más álbumes",
        investment: 200,
        winChance: 80,
        winGain: 450,
        riskLevel: "low" as const,
        icon: "📚",
      },
      {
        id: "B",
        title: "Otros Coleccionables",
        description: "Cartas de Pokémon, Yu-Gi-Oh, etc. Diversificar",
        investment: 350,
        winChance: 55,
        winGain: 750,
        riskLevel: "medium" as const,
        icon: "🎴",
      },
      {
        id: "C",
        title: "Franquicia con Amigos",
        description: "Crear una red de vendedores. Riesgo alto, ganancia épica",
        investment: 500,
        winChance: 30,
        winGain: 1400,
        riskLevel: "high" as const,
        icon: "🤝",
      },
    ],
  },
]

function ProgressReveal({
  isRevealing,
  result,
  onComplete,
  winChance,
  investment,
  potentialGain,
  onContinue,
}: ProgressRevealProps) {
  const [phase, setPhase] = useState<"analyzing" | "processing" | "revealing" | "result">("analyzing")
  const [progress, setProgress] = useState(0)
  const [showContinueButton, setShowContinueButton] = useState(false)

  useEffect(() => {
    if (isRevealing) {
      setPhase("analyzing")
      setProgress(0)
      setShowContinueButton(false)

      const analysisTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 30) {
            clearInterval(analysisTimer)
            setPhase("processing")
            return 30
          }
          return prev + 2
        })
      }, 100)

      setTimeout(() => {
        const processingTimer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 70) {
              clearInterval(processingTimer)
              setPhase("revealing")
              return 70
            }
            return prev + 3
          })
        }, 80)
      }, 1500)

      setTimeout(() => {
        const revealTimer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(revealTimer)
              setPhase("result")
              setShowContinueButton(true)
              onComplete()
              return 100
            }
            return prev + 5
          })
        }, 60)
      }, 3000)
    }
  }, [isRevealing, onComplete])

  const getPhaseMessage = () => {
    switch (phase) {
      case "analyzing":
        return "🔍 Analizando demanda del mercado..."
      case "processing":
        return "⚡ Evaluando estrategia comercial..."
      case "revealing":
        return "📊 Determinando resultado..."
      case "result":
        return result === "win" ? "✅ ¡NEGOCIO EXITOSO!" : "❌ NO FUE TU DÍA"
    }
  }

  const getProgressColor = () => {
    if (phase === "result") {
      return result === "win" ? "#10b981" : "#ef4444"
    }
    return "#3b82f6"
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-3">{getPhaseMessage()}</h3>

        <div className="flex gap-3 justify-center text-sm mb-6 flex-wrap">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">💰 Inversión: ${investment}</span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded">🎯 Probabilidad: {winChance}%</span>
          {phase === "result" && (
            <span className={result === "win" ? "bg-green-100 text-green-800 px-3 py-1 rounded" : "bg-red-100 text-red-800 px-3 py-1 rounded"}>
              {result === "win"
                ? `✅ Ganaste: $${potentialGain}`
                : `❌ Perdiste: $${investment}`}
            </span>
          )}
        </div>
      </div>

      <div className="w-full max-w-md mb-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Análisis de Negocio</span>
            <span className="text-blue-500">⚽</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progreso del Análisis</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: getProgressColor()
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-700">Probabilidad de Éxito</div>
                <div className="text-lg font-bold text-green-600">{winChance}%</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-semibold text-red-700">Riesgo de Pérdida</div>
                <div className="text-lg font-bold text-red-600">{100 - winChance}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {phase === "result" && (
        <div className="text-center mb-6 w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className={`text-6xl ${result === "win" ? "text-green-500" : "text-red-500"}`}>
              {result === "win" ? "🎉" : "😞"}
            </span>
          </div>
          <div
            className={`p-6 rounded-lg border-2 ${
              result === "win" ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
            }`}
          >
            <h4 className="text-lg font-bold mb-3">
              {result === "win" ? "¡La pegaste!" : "Esta vez no salió"}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {result === "win"
                ? `Tu estrategia funcionó bárbaro. Ganancia neta: $${(potentialGain - investment)}`
                : `No fue tu día, pero así es el negocio. Pérdida: $${investment}`}
            </p>
            {showContinueButton && (
              <button 
                onClick={onContinue} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto"
              >
                ➡️ Siguiente Decisión
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Component() {
  const [gameState, setGameState] = useState<GameState>({
    currentMoney: 1000,
    currentDecision: 0,
    gamePhase: "intro",
    decisions: [],
  })

  const [playerName, setPlayerName] = useState("")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [revealResult, setRevealResult] = useState<"win" | "lose">("lose")
  const [nameError, setNameError] = useState("")
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([])

  useEffect(() => {
    if (gameState.gamePhase === "playing" && gameState.currentDecision < baseDecisions.length) {
      const options = [...baseDecisions[gameState.currentDecision].options]
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[options[i], options[j]] = [options[j], options[i]]
      }
      setShuffledOptions(options)
    }
  }, [gameState.gamePhase, gameState.currentDecision])

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem("figuritas-mundial-leaderboard")
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    }
  }, [])

  const validateUsername = (name: string): boolean => {
    const trimmedName = name.trim()
    if (trimmedName.length === 0) {
      setNameError("¡Ponete un nombre, crack!")
      return false
    }
    if (trimmedName.length < 2) {
      setNameError("Muy cortito el nombre, ¿no?")
      return false
    }
    if (leaderboard.some((entry) => entry.name.toLowerCase() === trimmedName.toLowerCase())) {
      setNameError("Ese nombre ya lo agarró otro. ¡Inventate uno nuevo!")
      return false
    }
    setNameError("")
    return true
  }

  const saveToLeaderboard = (finalAmount: number, profile: string) => {
    if (!playerName.trim()) return

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerName.trim(),
      finalAmount,
      profile,
      date: new Date().toLocaleDateString(),
    }

    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.finalAmount - a.finalAmount).slice(0, 10)
    setLeaderboard(updatedLeaderboard)
    localStorage.setItem("figuritas-mundial-leaderboard", JSON.stringify(updatedLeaderboard))
  }

  const resetLeaderboard = () => {
    setLeaderboard([])
    localStorage.removeItem("figuritas-mundial-leaderboard")
  }

  const makeDecision = async (optionIndex: number) => {
    setSelectedOption(optionIndex)
    const option = shuffledOptions[optionIndex]
    const investment = Math.min(option.investment, gameState.currentMoney)
    const random = Math.random() * 100
    const result: "win" | "lose" = random < option.winChance ? "win" : "lose"
    setRevealResult(result)
    setGameState((prev) => ({ ...prev, gamePhase: "revealing" }))
  }

  const onRevealComplete = () => {
    // Animation completed
  }

  const onContinueToNext = () => {
    const option = shuffledOptions[selectedOption!]
    const investment = Math.min(option.investment, gameState.currentMoney)
    const potentialGain = option.winGain

    let newMoney = revealResult === "win" 
      ? gameState.currentMoney - investment + potentialGain 
      : gameState.currentMoney - investment

    // Asegurar que el jugador tenga al menos $100 para la siguiente decisión
    const isLastDecision = gameState.currentDecision === 2
    if (!isLastDecision && newMoney < 100) {
      newMoney = 100 // Dar suficiente dinero para continuar
    }

    const newDecisions = [
      ...gameState.decisions,
      {
        option: `${option.id}: ${option.title}`,
        invested: investment,
        result: revealResult,
        gained: revealResult === "win" ? potentialGain : 0,
      },
    ]

    setGameState((prev) => ({
      ...prev,
      currentMoney: Math.max(0, newMoney),
      decisions: newDecisions,
      currentDecision: prev.currentDecision + 1,
      gamePhase: prev.currentDecision === 2 ? "result" : "playing",
    }))

    setSelectedOption(null)

    if (gameState.currentDecision === 2) {
      setTimeout(() => {
        const finalAmount = Math.max(0, newMoney)
        const profile = getProfile(finalAmount)
        saveToLeaderboard(finalAmount, profile)
      }, 1000)
    }
  }

  const getProfile = (amount: number): string => {
    if (amount >= 3000)
      return "🏆 ¡CRACK TOTAL! Sos el próximo Bill Gates del ITBA. Tomaste riesgos inteligentes y la rompiste."
    if (amount >= 2000)
      return "🚀 ¡Muy bien jugado! Tenés mente de emprendedor. Con un poco más de data y análisis vas a ser imparable."
    if (amount >= 1500)
      return "📊 Buen trabajo. Jugaste conservador pero efectivo. Los datos te hubieran ayudado a ganar más."
    if (amount >= 1000)
      return "😌 Mantuviste tu plata inicial. No está mal, pero podés arriesgar un poco más la próxima."
    return "💪 Esta vez no salió, ¡pero así se aprende! En los negocios siempre hay una próxima oportunidad."
  }

  const resetGame = () => {
    setGameState({
      currentMoney: 1000,
      currentDecision: 0,
      gamePhase: "intro",
      decisions: [],
    })
    setPlayerName("")
    setSelectedOption(null)
    setNameError("")
    setShuffledOptions([])
  }

  const startGame = () => {
    if (validateUsername(playerName)) {
      setGameState((prev) => ({ ...prev, gamePhase: "playing" }))
    }
  }

  const getRiskColor = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
    }
  }

  const getRiskIcon = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low":
        return "🛡️"
      case "medium":
        return "⚡"
      case "high":
        return "🎲"
    }
  }

  const getRiskLabel = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low":
        return "SEGURO"
      case "medium":
        return "EQUILIBRADO"
      case "high":
        return "ARRIESGADO"
    }
  }

  if (gameState.gamePhase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          {/* Logo ITBA - Mejorado */}
          <div className="text-center mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg inline-block border-2 border-blue-600 hover:shadow-xl transition-shadow">
              <img
                src="/ITBA-logo.jpg"
                alt="Logo ITBA"
                className="h-16 md:h-20 object-contain mx-auto"
                style={{ maxWidth: 160 }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-3 font-medium">Instituto Tecnológico de Buenos Aires</p>
          </div>

          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-6 mb-8">
              <span className="text-6xl animate-bounce">⚽</span>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
                  El Dilema del Emprendedor
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-700">Figuritas del Mundial</h2>
                <div className="mt-4">
                  <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 text-sm rounded-full shadow-md">
                    ¿Tenés pasta de emprendedor?
                  </span>
                </div>
              </div>
              <span className="text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>🏆</span>
            </div>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-xl overflow-hidden">
            <div className="text-center bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100 py-8 px-6">
              <h2 className="text-xl md:text-2xl text-slate-800 font-bold mb-4">
                ¡Desafío Emprendedor ITBA!
              </h2>
              <p className="text-base mt-2 text-slate-600 max-w-2xl mx-auto leading-relaxed">
                ¿Arriesgás o guardás? Tenés $1000 para invertir en figuritas del Mundial. 
                Tomá decisiones inteligentes y descubrí si tenés instinto emprendedor.
              </p>
            </div>
            
            <div className="space-y-8 p-8">
              {/* Estadísticas del juego - Mejoradas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors">
                  <span className="text-3xl mb-3 block">💰</span>
                  <p className="text-sm font-medium text-slate-600 mb-2">Tu Plata Inicial</p>
                  <p className="text-3xl font-bold text-green-600">$1000</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-colors">
                  <span className="text-3xl mb-3 block">🎯</span>
                  <p className="text-sm font-medium text-slate-600 mb-2">Meta a Alcanzar</p>
                  <p className="text-3xl font-bold text-blue-600">$3000</p>
                </div>
                <div className="p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
                  <span className="text-3xl mb-3 block">⚽</span>
                  <p className="text-sm font-medium text-slate-600 mb-2">Decisiones Clave</p>
                  <p className="text-3xl font-bold text-yellow-600">3</p>
                </div>
              </div>

              {/* Descripción del desafío - Mejorada */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">🚀 El Desafío</h3>
                  <p className="text-base mb-4 text-slate-700">
                    3 decisiones estratégicas. $1000 para invertir. Meta: llegar a $3000 o más.
                  </p>
                  <p className="text-sm text-slate-600">
                    Cada decisión tiene diferentes riesgos y recompensas. ¿Tenés lo que se necesita para ser emprendedor?
                  </p>
                </div>
              </div>

              {/* Campo de nombre - Mejorado */}
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">👤 ¿Cómo te llamás?</h3>
                  <p className="text-sm text-slate-500">Ingresá tu nombre para aparecer en el ranking</p>
                </div>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value)
                    if (nameError) setNameError("")
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-base transition-colors ${
                    nameError 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Tu nombre aquí..."
                  onKeyPress={(e) => e.key === "Enter" && startGame()}
                />
                {nameError && (
                  <div className="mt-3 border-2 border-red-200 bg-red-50 rounded-lg p-4">
                    <p className="text-red-700 text-sm flex items-center gap-2">
                      <span>⚠️</span> {nameError}
                    </p>
                  </div>
                )}
              </div>

              {/* Botones - Mejorados */}
              <div className="flex justify-center gap-4 flex-wrap pt-4">
                <button
                  onClick={startGame}
                  disabled={!playerName.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 text-base font-semibold rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  ⚽ ¡Empezar Negocio!
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "tutorial" }))}
                  className="border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 px-6 py-3 text-base rounded-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  ❓ Cómo Jugar
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "leaderboard" }))}
                  className="border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 px-6 py-3 text-base rounded-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  🏆 Rankings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState.gamePhase === "tutorial") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center">
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">❓ Cómo Jugar</h1>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-blue-100 to-green-100 pb-6 pt-6 px-6 rounded-t-lg">
              <h2 className="text-xl font-bold">Reglas del Juego</h2>
            </div>
            <div className="space-y-6 p-6">
              
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  🎯 El Objetivo
                </h3>
                <p className="text-base mb-4">
                  Empezás con $1000 y tenés que llegar a $3000 o más. ¡Triplicar tu plata es el desafío!
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  ⚽ Cómo Funciona
                </h3>
                <div className="space-y-3 text-base">
                  <p>• Vas a tomar <strong>3 decisiones</strong> sobre tu negocio de figuritas</p>
                  <p>• Cada decisión requiere que <strong>inviertas dinero</strong></p>
                  <p>• Cada opción tiene una <strong>probabilidad de éxito</strong> diferente</p>
                  <p>• Si la pegás, ganás plata. Si no, la perdés</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  🎲 Tipos de Jugadas
                </h3>
                <div className="space-y-3 text-base">
                  <p><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">🛡️ SEGURO</span> Más chances de ganar, pero ganás menos</p>
                  <p><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">⚡ EQUILIBRADO</span> Riesgo y ganancia moderados</p>
                  <p><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">🎲 ARRIESGADO</span> Pocas chances, pero si sale... ¡la rompés!</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "intro" }))}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ← Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState.gamePhase === "leaderboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">🏆 Hall of Fame</h1>
            <p className="text-slate-600">Los mejores emprendedores del ITBA</p>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 pb-6 pt-6 px-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl flex items-center gap-2 font-bold">
                  👥 Top 10 Emprendedores
                </h2>
                <button 
                  onClick={resetLeaderboard}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
                >
                  🗑️ Reset
                </button>
              </div>
            </div>
            <div className="p-6">
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🏆</span>
                  <p className="text-slate-500 text-lg mb-2">¡Sé el primero en el ranking!</p>
                  <p className="text-slate-400 text-sm">Jugá y demostrá que tenés pasta de emprendedor</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-5 rounded-xl border-2 ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400"
                          : index === 1
                            ? "bg-gradient-to-r from-slate-100 to-slate-200 border-slate-400"
                            : index === 2
                              ? "bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400"
                              : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {index === 0 && <span className="text-2xl">👑</span>}
                        <span className={`text-base px-3 py-1 rounded ${index < 3 ? "bg-blue-600 text-white" : "bg-slate-400 text-white"}`}>
                          #{index + 1}
                        </span>
                        <span className="font-semibold text-base">{entry.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-lg flex items-center gap-1">
                          💰 ${entry.finalAmount}
                        </div>
                        <div className="text-sm text-slate-500">{entry.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-3 mt-8">
                <button 
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "intro" }))}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50"
                >
                  ← Volver
                </button>
                <button 
                  onClick={resetGame} 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  🔄 Nuevo Juego
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState.gamePhase === "revealing") {
    const currentDecisionData = baseDecisions[gameState.currentDecision]
    const selectedOptionData = shuffledOptions[selectedOption!]

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-3">
              {currentDecisionData.icon} Decisión {gameState.currentDecision + 1}/3
            </h1>
            <span className="border border-slate-300 text-base px-4 py-2 rounded">
              💰 Tu Plata: ${gameState.currentMoney}
            </span>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="text-center bg-gradient-to-r from-indigo-100 to-purple-100 pb-6 pt-6 px-6 rounded-t-lg">
              <h2 className="text-lg font-bold">
                {selectedOptionData.icon} {selectedOptionData.title}
              </h2>
              <p className="text-base mt-3">
                {selectedOptionData.winChance}% de chances • Invertiste: ${selectedOptionData.investment}
              </p>
            </div>
            <div>
              <ProgressReveal
                isRevealing={true}
                result={revealResult}
                onComplete={onRevealComplete}
                winChance={selectedOptionData.winChance}
                investment={selectedOptionData.investment}
                potentialGain={selectedOptionData.winGain}
                onContinue={onContinueToNext}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState.gamePhase === "result") {
    const profile = getProfile(gameState.currentMoney)
    const isSuccess = gameState.currentMoney >= 3000

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {isSuccess ? "🎉 ¡LA ROMPISTE!" : "📊 Resultado Final"}
            </h1>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 pb-6 pt-6 px-6 rounded-t-lg">
              <h2 className="text-center text-2xl flex items-center justify-center gap-3 font-bold">
                Tu Resultado Final:
                <span className={`flex items-center gap-2 ${isSuccess ? "text-green-600" : "text-orange-600"}`}>
                  💰 ${gameState.currentMoney}
                </span>
              </h2>
              <p className="text-center text-base font-medium mt-3">{profile}</p>
            </div>
            <div className="p-6">
              <div className="mb-8">
                <div className="flex justify-between text-base font-semibold mb-3">
                  <span>$0</span>
                  <span className="text-green-600">Meta: $3000</span>
                  <span>$5000+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <div 
                    className="bg-green-600 h-5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((gameState.currentMoney / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4 max-h-48 overflow-y-auto mb-8">
                <h3 className="font-semibold text-lg text-center">📋 Tu Historia Emprendedora:</h3>
                {gameState.decisions.map((decision, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-base font-medium">
                        {baseDecisions[index].icon} Decisión {index + 1}:{" "}
                        {decision.option.split(":")[1]?.trim() || decision.option}
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${decision.result === "win" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {decision.result === "win" ? "✅ La pegaste" : "❌ No salió"}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">
                      Invertiste: ${decision.invested}
                      {decision.result === "win"
                        ? ` → Ganaste: $${decision.gained}`
                        : " → Perdiste todo"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Logo ITBA y mensaje educativo */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 mb-8">
                <div className="bg-white p-3 rounded-lg shadow-md inline-block border-2 border-blue-600 mb-4">
                  <img
                    src="/ITBA-logo.jpg"
                    alt="Logo ITBA"
                    className="h-12 object-contain mx-auto"
                    style={{ maxWidth: 90 }}
                  />
                </div>
                <h4 className="font-semibold text-lg mb-3">🎓 En el ITBA formamos emprendedores</h4>
                <p className="text-sm text-slate-700 mb-3">
                  En el mundo de los negocios, siempre hay decisiones con distintos niveles de riesgo y recompensa. 
                  Un buen <strong>Lic. en Analítica Empresarial</strong> o <strong> Lic. en Negocios y Tecnología </strong> 
                  usa datos y gestiona con tecnología para entender el impacto de cada decisión.
                </p>
                <p className="text-sm text-slate-600 italic">
                  ¡No es magia, es analizar la data para tomar decisiones más inteligentes! 
                  En el ITBA te preparamos para eso.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button 
                  onClick={resetGame} 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded flex items-center gap-2"
                >
                  🔄 Jugar de Nuevo
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "leaderboard" }))}
                  className="border border-slate-300 hover:bg-slate-50 px-6 py-3 rounded flex items-center gap-2"
                >
                  🏆 Ver Rankings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentDecisionData = baseDecisions[gameState.currentDecision]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            {currentDecisionData.icon} {currentDecisionData.title}
          </h1>
          <div className="flex justify-center items-center gap-6 mb-4 flex-wrap">
            <span className="border border-slate-300 text-base px-4 py-2 rounded">
              💰 ${gameState.currentMoney}
            </span>
            <span className="border border-slate-300 text-base px-4 py-2 rounded">
              🎯 Meta: $3000
            </span>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold ${
                  step < gameState.currentDecision
                    ? "bg-green-500 text-white"
                    : step === gameState.currentDecision
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {step < gameState.currentDecision ? "✓" : step + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-2xl border-0 rounded-lg">
          <div className="bg-gradient-to-r from-slate-100 to-blue-100 pb-6 pt-6 px-6 rounded-t-lg">
            <p className="text-center text-base font-medium">
              {currentDecisionData.subtitle}
            </p>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 mt-4">
              <p className="text-base text-slate-700 text-center">{currentDecisionData.scenario}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {shuffledOptions.map((option, index) => {
                const canAfford = gameState.currentMoney >= option.investment
                const netGain = option.winGain - option.investment

                return (
                  <button
                    key={`${option.id}-${index}`}
                    className="h-auto p-4 text-left border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 transition-all rounded-lg bg-white"
                    onClick={() => makeDecision(index)}
                    disabled={!canAfford}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{option.icon}</span>
                          <h3 className="font-bold text-base">{option.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${getRiskColor(option.riskLevel)}`}>
                            {getRiskIcon(option.riskLevel)} {getRiskLabel(option.riskLevel)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-3">{option.description}</p>

                      <div className="bg-slate-50 p-3 rounded border text-sm">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4">
                            <span>💸 Costo: <strong className="text-red-600">${option.investment}</strong></span>
                            <span>🎯 Chances: <strong>{option.winChance}%</strong></span>
                          </div>
                          <div>
                            <span>💰 Ganancia: <strong className="text-green-600">+${netGain}</strong></span>
                          </div>
                        </div>

                        {!canAfford && (
                          <div className="mt-2 text-red-600 text-sm font-medium">
                            ⚠️ No te alcanza la plata
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}