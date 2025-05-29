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
  email: string
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
        riskLevel: "low" as const,
        icon: "📦",
      },
      {
        id: "B",
        title: "Mix Equilibrado",
        description: "Mitad comunes, mitad especiales. Riesgo moderado",
        investment: 250,
        winChance: 65,
        riskLevel: "medium" as const,
        icon: "⚖️",
      },
      {
        id: "C",
        title: "Figuritas Raras",
        description: "¡A por la dorada de Messi! Pocas chances, pero si sale...",
        investment: 350,
        winChance: 25,
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
        riskLevel: "low" as const,
        icon: "🏘️",
      },
      {
        id: "B",
        title: "En la Escuela",
        description: "Punto estratégico con muchos clientes potenciales",
        investment: 200,
        winChance: 60,
        riskLevel: "medium" as const,
        icon: "🎒",
      },
      {
        id: "C",
        title: "Online y Redes",
        description: "Instagram, TikTok, MercadoLibre. Alcance máximo",
        investment: 300,
        winChance: 35,
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
        description: "Seguir con lo que funciona. Comprar más álbumes del Mundial",
        investment: 200,
        winChance: 80,
        riskLevel: "low" as const,
        icon: "📚",
      },
      {
        id: "B",
        title: "Otros Coleccionables",
        description: "Cartas de Pokémon, Yu-Gi-Oh, etc. Diversificar",
        investment: 350,
        winChance: 55,
        riskLevel: "medium" as const,
        icon: "🎴",
      },
      {
        id: "C",
        title: "Franquicia con Amigos",
        description: "Crear una red de vendedores. Riesgo alto, ganancia épica",
        investment: 500,
        winChance: 30,
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
    <div className="flex flex-col items-center py-4">
      <div className="text-center mb-6">
        <h3 className="text-base lg:text-lg font-bold mb-2">{getPhaseMessage()}</h3>

        <div className="flex gap-2 justify-center text-xs mb-4 flex-wrap">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">💰 ${investment}</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🎯 {winChance}%</span>
          {phase === "result" && (
            <span className={result === "win" ? "bg-green-100 text-green-800 px-2 py-1 rounded" : "bg-red-100 text-red-800 px-2 py-1 rounded"}>
              {result === "win"
                ? `✅ +${potentialGain}`
                : `❌ -${investment}`}
            </span>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm lg:max-w-md mb-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-3 lg:p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-600">Análisis de Negocio</span>
            <span className="text-blue-500">⚽</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span>Progreso del Análisis</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: getProgressColor()
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-700">Éxito</div>
                <div className="text-sm font-bold text-green-600">{winChance}%</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-semibold text-red-700">Riesgo</div>
                <div className="text-sm font-bold text-red-600">{100 - winChance}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {phase === "result" && (
        <div className="text-center mb-4 w-full max-w-sm lg:max-w-md">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className={`text-3xl lg:text-4xl ${result === "win" ? "text-green-500" : "text-red-500"}`}>
              {result === "win" ? "🎉" : "😞"}
            </span>
          </div>
          <div
            className={`p-3 lg:p-4 rounded-lg border-2 ${
              result === "win" ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
            }`}
          >
            <h4 className="text-sm lg:text-base font-bold mb-2">
              {result === "win" ? "¡La pegaste!" : "Esta vez no salió"}
            </h4>
            <p className="text-xs lg:text-sm text-gray-600 mb-3">
              {result === "win"
                ? `Tu estrategia funcionó bárbaro. Ganancia neta: ${(potentialGain - investment)}`
                : `No fue tu día, pero así es el negocio. Pérdida: ${investment}`}
            </p>
            {showContinueButton && (
              <button 
                onClick={onContinue} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto text-sm lg:text-base"
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
  const [playerEmail, setPlayerEmail] = useState("")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [revealResult, setRevealResult] = useState<"win" | "lose">("lose")
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
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
    try {
      const savedLeaderboard = localStorage.getItem("figuritas-mundial-leaderboard")
      if (savedLeaderboard) {
        const parsedLeaderboard = JSON.parse(savedLeaderboard)
        // Migrar datos antiguos que no tienen email
        const migratedLeaderboard = parsedLeaderboard.map((entry: any) => ({
          ...entry,
          email: entry.email || "email.no.disponible@legacy.com" // Para entradas antiguas
        }))
        setLeaderboard(migratedLeaderboard)
        // Guardar la versión migrada
        localStorage.setItem("figuritas-mundial-leaderboard", JSON.stringify(migratedLeaderboard))
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error)
      // Si hay error, empezar con leaderboard vacío
      setLeaderboard([])
      localStorage.removeItem("figuritas-mundial-leaderboard")
    }
  }, [])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

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

  const validateEmailField = (email: string): boolean => {
    const trimmedEmail = email.trim()
    if (trimmedEmail.length === 0) {
      setEmailError("¡Necesitamos tu email!")
      return false
    }
    if (!validateEmail(trimmedEmail)) {
      setEmailError("El email no tiene un formato válido")
      return false
    }
    // Solo verificar duplicados para emails reales (no legacy)
    if (leaderboard.some((entry) => 
      entry.email && 
      entry.email !== "email.no.disponible@legacy.com" && 
      entry.email.toLowerCase() === trimmedEmail.toLowerCase()
    )) {
      setEmailError("Ese email ya está registrado. ¿Ya jugaste antes?")
      return false
    }
    setEmailError("")
    return true
  }

  const saveToLeaderboard = (finalAmount: number, profile: string) => {
    if (!playerName.trim() || !playerEmail.trim()) return

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerName.trim(),
      email: playerEmail.trim(),
      finalAmount,
      profile,
      date: new Date().toLocaleString(),
    }

    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.finalAmount - a.finalAmount)
    setLeaderboard(updatedLeaderboard)
    localStorage.setItem("figuritas-mundial-leaderboard", JSON.stringify(updatedLeaderboard))
  }



  const makeDecision = async (optionIndex: number) => {
    setSelectedOption(optionIndex)
    const option = shuffledOptions[optionIndex]
    const investment = Math.min(option.investment, gameState.currentMoney)
    
    const multiplier = 2.5 + (Math.random() * 1.5)
    const potentialGain = Math.round(investment * multiplier)
    
    const random = Math.random() * 100
    const result: "win" | "lose" = random < option.winChance ? "win" : "lose"
    setRevealResult(result)
    
    setShuffledOptions(prev => prev.map((opt, idx) => 
      idx === optionIndex ? { ...opt, calculatedGain: potentialGain } : opt
    ))
    
    setGameState((prev) => ({ ...prev, gamePhase: "revealing" }))
  }

  const onRevealComplete = () => {
    // Animation completed
  }

  const onContinueToNext = () => {
    const option = shuffledOptions[selectedOption!]
    const investment = Math.min(option.investment, gameState.currentMoney)
    const potentialGain = option.calculatedGain || (investment * 2.5)

    let newMoney = revealResult === "win" 
      ? gameState.currentMoney - investment + potentialGain 
      : gameState.currentMoney - investment

    const isLastDecision = gameState.currentDecision === 2
    if (!isLastDecision && newMoney < 100) {
      newMoney = 100
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
    if (amount >= 2000)
      return "🏆 ¡Crack total! Tomaste riesgos calculados y te la jugaste con inteligencia. Sos un estratega de alto impacto."
    if (amount >= 1600)
      return "🚀 ¡Muy bien jugado! Tenés mente de emprendedor. Con un poco más de data y análisis vas a ser imparable."
    if (amount >= 1200)
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
    setPlayerEmail("")
    setSelectedOption(null)
    setNameError("")
    setEmailError("")
    setShuffledOptions([])
  }

  const startGame = () => {
    const nameValid = validateUsername(playerName)
    const emailValid = validateEmailField(playerEmail)
    
    if (nameValid && emailValid) {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-3 sm:p-4 lg:p-6 flex items-center">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full">
          {/* Logo ITBA - Responsivo */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-md border border-blue-600">
              <img
                src="/ITBA-logo.jpg"
                alt="Logo ITBA"
                className="h-8 sm:h-12 lg:h-16 object-contain"
                style={{ maxWidth: "80px", sm: { maxWidth: "120px" }, lg: { maxWidth: "160px" } }}
              />
            </div>
          </div>

          <div className="text-center mb-6 lg:mb-8 mt-16 sm:mt-20 lg:mt-8">
            <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4 lg:mb-6">
              <span className="text-2xl sm:text-3xl lg:text-4xl animate-bounce">⚽</span>
              <div className="space-y-1 lg:space-y-2">
                <h1 className="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
                  El Dilema del Emprendedor
                </h1>
                <h2 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-semibold text-slate-700">La Carrera por el Mundial</h2>
                <div className="mt-2">
                  <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full shadow-md">
                    ¿Tenés pasta de emprendedor?
                  </span>
                </div>
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl animate-bounce" style={{animationDelay: '0.2s'}}>🏆</span>
            </div>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-xl overflow-hidden">
            <div className="text-center bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100 py-3 sm:py-4 lg:py-6 px-4 sm:px-6">
              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-800 font-bold mb-2">
                ¡Desafío Emprendedor ITBA!
              </h2>
              <p className="text-xs sm:text-sm lg:text-base mt-1 text-slate-600 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
                ¿Podés transformar $1000 en un negocio digno del Mundial México/Estados Unidos/Canadá 2026? Tomá decisiones, gestioná tu riesgo, y descubrí si sos de los que la rompen como Messi... o se quedan afuera en fase de grupos. ¿Lo tuyo es intuición, estrategia o suerte? ¡Jugá y descubrilo! En el ITBA te preparamos para tomar decisiones con impacto real, como en el mundo emprendedor.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
              {/* Estadísticas del juego - Responsivas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="p-3 sm:p-4 lg:p-6 bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors">
                  <span className="text-xl sm:text-2xl lg:text-3xl mb-2 block">💰</span>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Tu Plata Inicial</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600">$1000</p>
                </div>
                <div className="p-3 sm:p-4 lg:p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
                  <span className="text-xl sm:text-2xl lg:text-3xl mb-2 block">⚽</span>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Decisiones Clave</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-yellow-600">3</p>
                </div>
                <div className="p-3 sm:p-4 lg:p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-colors">
                  <span className="text-xl sm:text-2xl lg:text-3xl mb-2 block">🎯</span>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Meta a Alcanzar</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600">$2000</p>
                </div>
              </div>

              {/* Descripción del desafío */}
              <div className="text-center space-y-3 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto">
                <div className="bg-slate-50 p-3 sm:p-4 lg:p-6 rounded-xl border border-slate-200">
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-800 mb-2">Cada decisión tiene diferentes riesgos y recompensas. ¿Tenés lo que se necesita para ser emprendedor?</p>
                </div>
              </div>

              {/* Campos de registro */}
              <div className="max-w-xs sm:max-w-md lg:max-w-lg mx-auto space-y-4">
                <div className="text-center">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-700 mb-1">👤 Registrate para jugar</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Ingresá tus datos para aparecer en el ranking</p>
                </div>
                
                {/* Campo de nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value)
                      if (nameError) setNameError("")
                    }}
                    className={`w-full px-3 py-2 lg:px-4 lg:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm lg:text-base transition-colors ${
                      nameError 
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                        : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Tu nombre aquí..."
                  />
                  {nameError && (
                    <div className="mt-2 border-2 border-red-200 bg-red-50 rounded-lg p-2">
                      <p className="text-red-700 text-xs sm:text-sm flex items-center gap-2">
                        <span>⚠️</span> {nameError}
                      </p>
                    </div>
                  )}
                </div>

                {/* Campo de email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={playerEmail}
                    onChange={(e) => {
                      setPlayerEmail(e.target.value)
                      if (emailError) setEmailError("")
                    }}
                    className={`w-full px-3 py-2 lg:px-4 lg:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm lg:text-base transition-colors ${
                      emailError 
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                        : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="tu.email@ejemplo.com"
                    onKeyPress={(e) => e.key === "Enter" && startGame()}
                  />
                  {emailError && (
                    <div className="mt-2 border-2 border-red-200 bg-red-50 rounded-lg p-2">
                      <p className="text-red-700 text-xs sm:text-sm flex items-center gap-2">
                        <span>⚠️</span> {emailError}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-center gap-2 sm:gap-3 flex-wrap pt-2">
                <button
                  onClick={startGame}
                  disabled={!playerName.trim() || !playerEmail.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 lg:py-3 text-xs sm:text-sm lg:text-base font-semibold rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  ⚽ ¡Empezar Negocio!
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "tutorial" }))}
                  className="border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 px-3 sm:px-4 py-2 lg:py-3 text-xs sm:text-sm lg:text-base rounded-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  ❓ Cómo Jugar
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "leaderboard" }))}
                  className="border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 px-3 sm:px-4 py-2 lg:py-3 text-xs sm:text-sm lg:text-base rounded-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-3 sm:p-4 lg:p-6 flex items-center">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto w-full">
          {/* Logo ITBA */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-md border border-blue-600">
              <img
                src="/ITBA-logo.jpg"
                alt="Logo ITBA"
                className="h-8 sm:h-12 lg:h-16 object-contain"
                style={{ maxWidth: "80px" }}
              />
            </div>
          </div>
          
          <div className="text-center mb-4 mt-16 sm:mt-20 lg:mt-8">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">❓ Cómo Jugar</h1>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-blue-100 to-green-100 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 rounded-t-lg">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold">Reglas del Juego</h2>
            </div>
            <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-4 sm:p-5 lg:p-8">
              
              <div className="bg-green-50 p-3 sm:p-4 lg:p-6 rounded-xl border border-green-200">
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 flex items-center gap-2">
                  🎯 El Objetivo
                </h3>
                <p className="text-xs sm:text-sm lg:text-base mb-2">
                  Empezás con $1000 y tenés que llegar a $2000 o más. ¡Duplicar tu plata es el desafío!
                </p>
              </div>

              <div className="bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 flex items-center gap-2">
                  ⚽ Cómo Funciona
                </h3>
                <div className="space-y-2 text-xs sm:text-sm lg:text-base">
                  <p>• Vas a tomar <strong>3 decisiones</strong> sobre tu negocio de figuritas</p>
                  <p>• Cada decisión requiere que <strong>inviertas dinero</strong></p>
                  <p>• Cada opción tiene una <strong>probabilidad de éxito</strong> diferente</p>
                  <p>• Si la pegás, ganás plata. Si no, la perdés</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 sm:p-4 lg:p-6 rounded-xl border border-yellow-200">
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 flex items-center gap-2">
                  🎲 Tipos de Jugadas
                </h3>
                <div className="space-y-2 text-xs sm:text-sm lg:text-base">
                  <p><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">🛡️ SEGURO</span> Más chances de ganar, pero ganás menos</p>
                  <p><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">⚡ EQUILIBRADO</span> Riesgo y ganancia moderados</p>
                  <p><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">🎲 ARRIESGADO</span> Pocas chances, pero si sale... ¡la rompés!</p>
                </div>
              </div>

              <div className="bg-orange-50 p-3 sm:p-4 lg:p-6 rounded-xl border border-orange-200">
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 flex items-center gap-2">
                  💰 Ganancias Variables
                </h3>
                <p className="text-xs sm:text-sm lg:text-base">
                  Las ganancias varían entre <strong>150% y 300%</strong> del costo de inversión. 
                  ¡Cada jugada es una sorpresa!
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "intro" }))}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs sm:text-sm lg:text-base"
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-3 sm:p-4 lg:p-6 flex items-center">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto w-full">
          {/* Logo ITBA */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-md border border-blue-600">
              <img
                src="/ITBA-logo.jpg"
                alt="Logo ITBA"
                className="h-8 sm:h-12 lg:h-16 object-contain"
                style={{ maxWidth: "80px" }}
              />
            </div>
          </div>
          
          <div className="text-center mb-4 mt-16 sm:mt-20 lg:mt-8">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">🏆 Hall of Fame</h1>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base">Todos los emprendedores del ITBA ({leaderboard.length} jugadores)</p>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 rounded-t-lg">
              <h2 className="text-base sm:text-lg lg:text-xl flex items-center gap-2 font-bold">
                👥 Ranking Completo
              </h2>
            </div>
            <div className="p-4 sm:p-5 lg:p-8">
              {leaderboard.length === 0 ? (
                <div className="text-center py-6 sm:py-8 lg:py-12">
                  <span className="text-3xl sm:text-4xl lg:text-5xl mb-3 block">🏆</span>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg mb-2">¡Sé el primero en el ranking!</p>
                  <p className="text-slate-400 text-xs sm:text-sm lg:text-base">Jugá y demostrá que tenés pasta de emprendedor</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-96 sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 sm:p-4 lg:p-5 rounded-xl border-2 ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400"
                          : index === 1
                            ? "bg-gradient-to-r from-slate-100 to-slate-200 border-slate-400"
                            : index === 2
                              ? "bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400"
                              : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <span className={`text-xs sm:text-sm px-2 py-1 rounded flex-shrink-0 ${index < 3 ? "bg-blue-600 text-white" : "bg-slate-400 text-white"}`}>
                          #{index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-xs sm:text-sm lg:text-base truncate">{entry.name}</span>
                            {index === 0 && <span className="text-base sm:text-lg flex-shrink-0">🥇</span>}
                            {index === 1 && <span className="text-base sm:text-lg flex-shrink-0">🥈</span>}
                            {index === 2 && <span className="text-base sm:text-lg flex-shrink-0">🥉</span>}
                          </div>
                          <div className="text-xs text-slate-600 truncate">{entry.email}</div>
                          <div className="text-xs text-slate-500">{entry.date}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="font-bold text-green-600 text-sm sm:text-base lg:text-lg flex items-center gap-1">
                          💰 ${entry.finalAmount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button 
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "intro" }))}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded hover:bg-slate-50 text-xs sm:text-sm lg:text-base"
                >
                  ← Volver
                </button>
                <button 
                  onClick={resetGame} 
                  className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded flex items-center gap-2 text-xs sm:text-sm lg:text-base"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-3 sm:p-4 lg:p-6 flex items-center">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full">
          {/* Logo ITBA */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-md border border-blue-600">
              <img
                src="/ITBA-logo.jpg"
                alt="Logo ITBA"
                className="h-8 sm:h-12 lg:h-16 object-contain"
                style={{ maxWidth: "80px" }}
              />
            </div>
          </div>
          
          <div className="text-center mb-4 mt-16 sm:mt-20 lg:mt-8">
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-800 mb-2">
              {currentDecisionData.icon} Decisión {gameState.currentDecision + 1}/3
            </h1>
            <span className="border border-slate-300 text-xs sm:text-sm lg:text-base px-3 py-1 rounded">
              💰 Tu Plata: ${gameState.currentMoney}
            </span>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="text-center bg-gradient-to-r from-indigo-100 to-purple-100 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 rounded-t-lg">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold">
                {selectedOptionData.icon} {selectedOptionData.title}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base mt-2">
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
                potentialGain={selectedOptionData.calculatedGain || (selectedOptionData.investment * 2.5)}
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
    const isSuccess = gameState.currentMoney >= 2000

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-3 sm:p-4 lg:p-6 flex items-center">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full">
          {/* Logo ITBA */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-md border border-blue-600">
              <img
                src="/ITBA-logo.jpg"
                alt="Logo ITBA"
                className="h-8 sm:h-12 lg:h-16 object-contain"
                style={{ maxWidth: "80px" }}
              />
            </div>
          </div>
          
          <div className="text-center mb-4 sm:mb-6 mt-16 sm:mt-20 lg:mt-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-800 mb-2">
              {isSuccess ? "🎉 ¡LA ROMPISTE!" : "📊 Resultado Final"}
            </h1>
          </div>

          <div className="bg-white shadow-2xl border-0 rounded-lg">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 pb-4 sm:pb-6 pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 rounded-t-lg">
              <h2 className="text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl flex items-center justify-center gap-2 sm:gap-3 font-bold flex-col sm:flex-row">
                <span>Tu Resultado Final:</span>
                <span className={`flex items-center gap-2 ${isSuccess ? "text-green-600" : "text-orange-600"}`}>
                  💰 ${gameState.currentMoney}
                </span>
              </h2>
              <p className="text-center text-xs sm:text-sm lg:text-base xl:text-lg font-medium mt-3 px-2">{profile}</p>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between text-xs sm:text-sm lg:text-base font-semibold mb-3">
                  <span>$0</span>
                  <span className="text-green-600">Meta: $2000</span>
                  <span>$4000+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 sm:h-5">
                  <div 
                    className="bg-green-600 h-4 sm:h-5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((gameState.currentMoney / 4000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 max-h-40 sm:max-h-48 lg:max-h-60 overflow-y-auto mb-6 sm:mb-8">
                <h3 className="font-semibold text-base sm:text-lg lg:text-xl text-center">📋 Tu Historia Emprendedora:</h3>
                {gameState.decisions.map((decision, index) => (
                  <div key={index} className="p-3 sm:p-4 bg-slate-50 rounded-lg border">
                    <div className="flex justify-between items-center mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
                      <div className="text-xs sm:text-sm lg:text-base font-medium text-center sm:text-left">
                        {baseDecisions[index].icon} Decisión {index + 1}:{" "}
                        {decision.option.split(":")[1]?.trim() || decision.option}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${decision.result === "win" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {decision.result === "win" ? "✅ La pegaste" : "❌ No salió"}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                      Invertiste: ${decision.invested}
                      {decision.result === "win"
                        ? ` → Ganaste: $${decision.gained}`
                        : " → Perdiste todo"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensaje educativo ITBA */}
              <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 mb-6 sm:mb-8">
                <h4 className="font-semibold text-sm sm:text-base lg:text-lg xl:text-xl mb-3">🎓 En el ITBA formamos emprendedores</h4>
                <p className="text-xs sm:text-sm lg:text-base text-slate-700 mb-3">
                  En el mundo de los negocios, siempre hay decisiones con distintos niveles de riesgo y recompensa. 
                  Un buen <strong>Lic. en Analítica Empresarial</strong> y <strong>Lic. en Negocios y Tecnología </strong> 
                  usa datos y gestiona con tecnología para entender el impacto de cada decisión.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 italic">
                  ¡No es magia, es analizar la data para tomar decisiones más inteligentes! 
                  En el ITBA te preparamos para eso.
                </p>
              </div>

              <div className="flex justify-center gap-3 sm:gap-4 flex-col sm:flex-row">
                <button 
                  onClick={resetGame} 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  🔄 Jugar de Nuevo
                </button>
                <button
                  onClick={() => setGameState((prev) => ({ ...prev, gamePhase: "leaderboard" }))}
                  className="border border-slate-300 hover:bg-slate-50 px-4 sm:px-6 py-2 sm:py-3 rounded flex items-center justify-center gap-2 text-sm sm:text-base"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-4 lg:p-6 flex items-center">
      <div className="max-w-xl sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full">
        {/* Logo ITBA */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
          <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-md border border-blue-600">
            <img
              src="/ITBA-logo.jpg"
              alt="Logo ITBA"
              className="h-8 sm:h-12 lg:h-16 object-contain"
              style={{ maxWidth: "80px" }}
            />
          </div>
        </div>
        
        <div className="text-center mb-4 mt-16 sm:mt-20 lg:mt-8">
          <h1 className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-800 mb-2">
            {currentDecisionData.icon} {currentDecisionData.title}
          </h1>
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-3 flex-wrap">
            <span className="border border-slate-300 text-xs sm:text-sm lg:text-base px-3 py-1 rounded">
              💰 ${gameState.currentMoney}
            </span>
            <span className="border border-slate-300 text-xs sm:text-sm lg:text-base px-3 py-1 rounded">
              🎯 Meta: $2000
            </span>
          </div>

          <div className="flex justify-center gap-1 sm:gap-2 mb-4">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm lg:text-base font-bold ${
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
          <div className="bg-gradient-to-r from-slate-100 to-blue-100 py-3 sm:py-4 lg:py-6 px-3 sm:px-4 lg:px-6 rounded-t-lg">
            <p className="text-center text-xs sm:text-sm lg:text-base font-medium mb-3">
              {currentDecisionData.subtitle}
            </p>
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <p className="text-xs sm:text-sm lg:text-base text-slate-700 text-center">{currentDecisionData.scenario}</p>
            </div>
          </div>
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-1 xl:grid-cols-1">
              {shuffledOptions.map((option, index) => {
                const canAfford = gameState.currentMoney >= option.investment
                const minGain = Math.round(option.investment * 2.5)
                const maxGain = Math.round(option.investment * 4)

                return (
                  <button
                    key={`${option.id}-${index}`}
                    className="h-auto p-3 sm:p-4 lg:p-5 text-left border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 transition-all rounded-lg bg-white"
                    onClick={() => makeDecision(index)}
                    disabled={!canAfford}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg lg:text-xl">{option.icon}</span>
                          <h3 className="font-bold text-sm sm:text-base lg:text-lg">{option.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${getRiskColor(option.riskLevel)}`}>
                            {getRiskIcon(option.riskLevel)} {getRiskLabel(option.riskLevel)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm lg:text-base text-slate-600 mb-2 text-center sm:text-left">{option.description}</p>

                      <div className="bg-slate-50 p-2 sm:p-3 rounded border text-xs sm:text-sm">
                        <div className="flex justify-between items-center flex-col sm:flex-row gap-2 sm:gap-0">
                          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                            <span>💸 <strong className="text-red-600">${option.investment}</strong></span>
                            <span>🎯 <strong>{option.winChance}%</strong></span>
                          </div>
                          <div>
                            <span>💰 <strong className="text-green-600">${minGain} - ${maxGain}</strong></span>
                          </div>
                        </div>

                        {!canAfford && (
                          <div className="mt-1 text-red-600 text-xs font-medium text-center sm:text-left">
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