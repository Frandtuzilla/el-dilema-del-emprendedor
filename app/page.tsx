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
    title: "Decisión 1: Tu Producto",
    subtitle: "¿Con qué tecnología arrancás?",
    scenario:
      "🚀 Tenés $100 para crear tu startup. Elegí qué tipo de producto vas a desarrollar:",
    icon: "💻",
    options: [
      {
        id: "A",
        title: "App Móvil Simple",
        description: "App básica y funcional",
        investment: 15,
        winChance: 85,
        winGain: 40,
        riskLevel: "low" as const,
        icon: "📱",
      },
      {
        id: "B",
        title: "Plataforma Web",
        description: "Sistema web con mayor potencial",
        investment: 25,
        winChance: 60,
        winGain: 75,
        riskLevel: "medium" as const,
        icon: "🌐",
      },
      {
        id: "C",
        title: "Tecnología IA",
        description: "IA disruptiva. Alto riesgo, alto retorno",
        investment: 35,
        winChance: 30,
        winGain: 120,
        riskLevel: "high" as const,
        icon: "🤖",
      },
    ],
  },
  {
    title: "Decisión 2: Financiamiento",
    subtitle: "¿Cómo conseguís capital para crecer?",
    scenario:
      "💰 Tu producto funciona y necesitás más capital. Elegí tu estrategia de financiamiento:",
    icon: "💰",
    options: [
      {
        id: "A",
        title: "Capital Propio",
        description: "Recursos propios. Control total",
        investment: 15,
        winChance: 80,
        winGain: 35,
        riskLevel: "low" as const,
        icon: "💪",
      },
      {
        id: "B",
        title: "Préstamo Bancario",
        description: "Capital seguro pero con intereses",
        investment: 25,
        winChance: 55,
        winGain: 65,
        riskLevel: "medium" as const,
        icon: "🏦",
      },
      {
        id: "C",
        title: "Inversores de Riesgo",
        description: "Venture capital. Mucho dinero, menos control",
        investment: 35,
        winChance: 35,
        winGain: 100,
        riskLevel: "high" as const,
        icon: "💎",
      },
    ],
  },
  {
    title: "Decisión 3: Escalamiento",
    subtitle: "¿Cómo expandís tu startup?",
    scenario:
      "🚀 Tu startup crece. Decidí tu estrategia de expansión:",
    icon: "🚀",
    options: [
      {
        id: "A",
        title: "Mercado Local",
        description: "Enfoque regional. Seguro pero limitado",
        investment: 20,
        winChance: 85,
        winGain: 50,
        riskLevel: "low" as const,
        icon: "🏠",
      },
      {
        id: "B",
        title: "Expansión Nacional",
        description: "Crecimiento a todo el país",
        investment: 30,
        winChance: 65,
        winGain: 85,
        riskLevel: "medium" as const,
        icon: "🗺️",
      },
      {
        id: "C",
        title: "Mercado Global",
        description: "Expansión internacional. Todo o nada",
        investment: 40,
        winChance: 40,
        winGain: 130,
        riskLevel: "high" as const,
        icon: "🌍",
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
        return "🔍 Analizando variables de mercado..."
      case "processing":
        return "⚡ Evaluando viabilidad técnica..."
      case "revealing":
        return "📊 Determinando resultado..."
      case "result":
        return result === "win" ? "✅ INVERSIÓN EXITOSA" : "❌ INVERSIÓN NO EXITOSA"
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
                ? `✅ Retorno: $${potentialGain}`
                : `❌ Pérdida: $${investment}`}
            </span>
          )}
        </div>
      </div>

      <div className="w-full max-w-md mb-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Análisis de Startup</span>
            <span className="text-blue-500">📊</span>
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
                <div className="font-semibold text-red-700">Riesgo de Fracaso</div>
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
              {result === "win" ? "✅" : "❌"}
            </span>
          </div>
          <div
            className={`p-6 rounded-lg border-2 ${
              result === "win" ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
            }`}
          >
            <h4 className="text-lg font-bold mb-3">
              {result === "win" ? "Inversión Exitosa" : "Inversión No Exitosa"}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {result === "win"
                ? `Tu estrategia de startup fue exitosa. Retorno neto: $${(potentialGain - investment)}`
                : `El mercado no respondió favorablemente. Pérdida: $${investment}`}
            </p>
            {showContinueButton && (
              <button 
                onClick={onContinue} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto"
              >
                ➡️ Continuar al Siguiente Paso
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
    currentMoney: 100,
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
    const savedLeaderboard = localStorage.getItem("startup-tech-leaderboard")
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    }
  }, [])

  const validateUsername = (name: string): boolean => {
    const trimmedName = name.trim()
    if (trimmedName.length === 0) {
      setNameError("El nombre no puede estar vacío")
      return false
    }
    if (trimmedName.length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres")
      return false
    }
    if (leaderboard.some((entry) => entry.name.toLowerCase() === trimmedName.toLowerCase())) {
      setNameError("Este nombre ya está registrado. Selecciona otro.")
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
    localStorage.setItem("startup-tech-leaderboard", JSON.stringify(updatedLeaderboard))
  }

  const resetLeaderboard = () => {
    setLeaderboard([])
    localStorage.removeItem("startup-tech-leaderboard")
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

    // Asegurar que el jugador tenga al menos $15 para la siguiente decisión (costo mínimo)
    const isLastDecision = gameState.currentDecision === 2
    if (!isLastDecision && newMoney < 15) {
      newMoney = 15 // Dar suficiente dinero para continuar
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
    if (amount >= 300)
      return "🦄 ¡Crack total! Tomaste riesgos calculados y te la jugaste con inteligencia. Sos un estratega de alto impacto."
    if (amount >= 200)
      return "🚀 Muy bien jugado. Estuviste cerca de la cima. Tenés perfil, con algunos ajustes vas a romperla."
    if (amount >= 150)
      return "📈 Conservador, pero con potencial. A veces hay que animarse más."
    if (amount >= 100)
      return "😐 Mantuviste el capital inicial. No fue tu mejor jugada, pero te llevás el aprendizaje."
    return "💸 No fue tu startup... pero en el mundo emprendedor se aprende de los errores, y eso también suma."
  }

  const resetGame = () => {
    setGameState({
      currentMoney: 100,
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
        return "⚠️"
    }
  }

  const getRiskLabel = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low":
        return "BAJO RIESGO"
      case "medium":
        return "RIESGO MODERADO"
      case "high":
        return "ALTO RIESGO"
    }
  }

  if (gameState.gamePhase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-5xl">💻</span>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dilema Emprendedor
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-700">La Startup del Futuro</h2>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 mt-2 text-sm rounded">
                  Desafío ITBA - ¿Tenés lo que se necesita?
                </span>
              </div>
              <span className="text-5xl">🚀</span>
            </div>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="text-center bg-gradient-to-r from-slate-100 to-blue-100 rounded-t-lg pb-6 pt-6 px-6">
              <h2 className="text-xl md:text-2xl text-slate-800 font-bold mb-2">
                Desafío Emprendedor ITBA
              </h2>
              <p className="text-base mt-2 text-slate-600">
                Transformá $100 en una startup exitosa. Tomá decisiones inteligentes, gestioná el riesgo y demostrá si tenés lo necesario para triunfar en el mundo empresarial.
              </p>
            </div>
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-2xl mb-2 block">💰</span>
                  <p className="text-sm font-medium text-slate-600">Capital Inicial</p>
                  <p className="text-2xl font-bold text-green-600">$100</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-2xl mb-2 block">🎯</span>
                  <p className="text-sm font-medium text-slate-600">Objetivo</p>
                  <p className="text-2xl font-bold text-blue-600">$300</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-2xl mb-2 block">📊</span>
                  <p className="text-sm font-medium text-slate-600">Decisiones</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-base mb-3">
                  3 decisiones. $100 de capital inicial. Objetivo: llegar a $300 o más.
                </p>
                <p className="text-sm text-slate-600">
                  Cada decisión tiene diferentes niveles de riesgo y retorno. ¿Podés tomar las decisiones correctas?
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value)
                    if (nameError) setNameError("")
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                    nameError ? "border-red-300 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"
                  }`}
                  placeholder="Ingresa tu nombre de emprendedor"
                  onKeyPress={(e) => e.key === "Enter" && startGame()}
                />
                {nameError && (
                  <div className="mt-3 border-red-200 bg-red-50 rounded p-3">
                    <p className="text-red-700 text-sm">⚠️ {nameError}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={startGame}
                  disabled={!playerName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 text-base rounded flex items-center gap-2"
                >
                  ▶️ Crear Startup
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "tutorial" }))}
                  className="border border-slate-300 hover:bg-slate-50 px-6 py-3 text-base rounded flex items-center gap-2"
                >
                  ℹ️ Cómo Jugar
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "leaderboard" }))}
                  className="border border-slate-300 hover:bg-slate-50 px-6 py-3 text-base rounded flex items-center gap-2"
                >
                  👑 Rankings
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center">
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">📋 Cómo Jugar</h1>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 pb-6 pt-6 px-6 rounded-t-lg">
              <h2 className="text-xl font-bold">Reglas del Juego</h2>
            </div>
            <div className="space-y-6 p-6">
              
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  🎯 Objetivo
                </h3>
                <p className="text-base mb-4">
                  Comienza con $100 y trata de llegar a $300 o más al final del juego.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  🎮 Cómo Funciona
                </h3>
                <div className="space-y-3 text-base">
                  <p>• Tomarás <strong>3 decisiones</strong> para hacer crecer tu startup</p>
                  <p>• Cada decisión requiere una <strong>inversión de dinero</strong></p>
                  <p>• Cada opción tiene una <strong>probabilidad de éxito</strong> diferente</p>
                  <p>• Si tienes éxito, ganas dinero. Si fallas, pierdes la inversión</p>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  ⚡ Tipos de Estrategia
                </h3>
                <div className="space-y-3 text-base">
                  <p><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">🛡️ SEGURA</span> Mayor probabilidad de éxito, menor ganancia</p>
                  <p><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">⚡ EQUILIBRADA</span> Riesgo y ganancia moderados</p>
                  <p><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">⚠️ ARRIESGADA</span> Menor probabilidad, mayor ganancia</p>
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">🏆 Hall of Fame Emprendedor</h1>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 pb-6 pt-6 px-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl flex items-center gap-2 font-bold">
                  👥 Top 10 Startups
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
                  <p className="text-slate-500 text-lg mb-2">Sé el primer emprendedor en el ranking</p>
                  <p className="text-slate-400 text-sm">Crea tu startup y compite por el primer lugar</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-5 rounded-xl border-2 ${
                        index === 0
                          ? "bg-gradient-to-r from-amber-100 to-amber-200 border-amber-400"
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
                  ← Regresar
                </button>
                <button 
                  onClick={resetGame} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  🔄 Nueva Startup
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
              {currentDecisionData.icon} Paso {gameState.currentDecision + 1}/3
            </h1>
            <span className="border border-slate-300 text-base px-4 py-2 rounded">
              💰 Capital Disponible: ${gameState.currentMoney}
            </span>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="text-center bg-gradient-to-r from-indigo-100 to-purple-100 pb-6 pt-6 px-6 rounded-t-lg">
              <h2 className="text-lg font-bold">
                {selectedOptionData.icon} {selectedOptionData.title}
              </h2>
              <p className="text-base mt-3">
                {selectedOptionData.winChance}% de probabilidad • Inversión: ${selectedOptionData.investment}
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
    const isSuccess = gameState.currentMoney >= 300

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {isSuccess ? "🎉 Startup Exitosa" : "📊 Resultado Final"}
            </h1>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 pb-6 pt-6 px-6 rounded-t-lg">
              <h2 className="text-center text-2xl flex items-center justify-center gap-3 font-bold">
                Valoración Final:
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
                  <span className="text-green-600">Objetivo: $300</span>
                  <span>$500+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <div 
                    className="bg-blue-600 h-5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((gameState.currentMoney / 500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4 max-h-48 overflow-y-auto mb-8">
                <h3 className="font-semibold text-lg text-center">📋 Historia de tu Startup:</h3>
                {gameState.decisions.map((decision, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-base font-medium">
                        {baseDecisions[index].icon} Paso {index + 1}:{" "}
                        {decision.option.split(":")[1]?.trim() || decision.option}
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${decision.result === "win" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {decision.result === "win" ? "📈 Exitosa" : "📉 Fallida"}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">
                      Inversión: ${decision.invested}
                      {decision.result === "win"
                        ? ` → Retorno: $${decision.gained}`
                        : " → Pérdida total"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-8">
                <h4 className="font-semibold text-lg mb-3">🎓 En el ITBA formamos emprendedores</h4>
                <p className="text-sm text-slate-700">
                  "Cada decisión empresarial implica riesgo, análisis y visión estratégica. Desarrollamos las competencias necesarias para tomar decisiones con impacto real en el mundo de los negocios."
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button 
                  onClick={resetGame} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded flex items-center gap-2"
                >
                  🔄 Nueva Startup
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "leaderboard" }))}
                  className="border border-slate-300 hover:bg-slate-50 px-6 py-3 rounded flex items-center gap-2"
                >
                  👑 Ver Rankings
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
              🎯 Objetivo: $300
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
                            <span>📊 Éxito: <strong>{option.winChance}%</strong></span>
                          </div>
                          <div>
                            <span>💰 Ganancia: <strong className="text-green-600">+${netGain}</strong></span>
                          </div>
                        </div>

                        {!canAfford && (
                          <div className="mt-2 text-red-600 text-sm font-medium">
                            ⚠️ Capital insuficiente
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