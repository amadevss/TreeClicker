"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TreePine, Home, Leaf, Sparkles, Award } from "lucide-react"

// Hook personalizado para evitar problemas de hidratación
function useClientOnly() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return isClient
}

export default function GamePage() {
  const [clicks, setClicks] = useState(0)
  const [trees, setTrees] = useState(0)
  const [isPlanting, setIsPlanting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [clickAnimation, setClickAnimation] = useState(false)
  const isClient = useClientOnly()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedClicks = localStorage.getItem("treeClicker_clicks")
    const savedTrees = localStorage.getItem("treeClicker_trees")

    if (savedClicks) setClicks(Number.parseInt(savedClicks))
    if (savedTrees) setTrees(Number.parseInt(savedTrees))
  }, [])

  // Save data to localStorage whenever clicks or trees change
  useEffect(() => {
    localStorage.setItem("treeClicker_clicks", clicks.toString())
  }, [clicks])

  useEffect(() => {
    localStorage.setItem("treeClicker_trees", trees.toString())
  }, [trees])

  const handleClick = () => {
    const newClicks = clicks + 1
    setClicks(newClicks)
    setClickAnimation(true)

    // Reset click animation
    setTimeout(() => setClickAnimation(false), 200)

    // Check if we should plant a tree
    if (newClicks >= 100 && newClicks % 100 === 0) {
      plantTree()
    }
  }

  const plantTree = () => {
    setIsPlanting(true)
    setShowCelebration(true)

    setTimeout(() => {
      setTrees((prev) => prev + 1)
      setIsPlanting(false)
    }, 1500)

    setTimeout(() => {
      setShowCelebration(false)
    }, 3000)
  }

  const progress = clicks % 100 // Progress as percentage
  const clicksToNextTree = 100 - (clicks % 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="falling-leaves">
            {[...Array(15)].map((_, i) => (
              <Leaf
                key={i}
                className="absolute text-green-400 opacity-40 animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-green-800 mb-2">Tree Planted!</h2>
            <p className="text-xl text-green-600">You&apos;ve grown your forest!</p>
            <div className="mt-4 flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="w-8 h-8 text-yellow-400 animate-spin"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="outline" className="bg-white/70 backdrop-blur-sm border-green-200">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-green-800">Tree Clicker</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-800 mb-2">{clicks.toLocaleString()}</div>
              <div className="text-green-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Total Clicks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-800 mb-2">{trees}</div>
              <div className="text-green-600 flex items-center justify-center gap-2">
                <TreePine className="w-4 h-4" />
                Trees Planted
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-800 mb-2">{clicksToNextTree}</div>
              <div className="text-green-600 flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                Clicks to Next Tree
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-700 font-medium">Progress to Next Tree</span>
              <span className="text-green-600">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-green-100" />
          </CardContent>
        </Card>

        {/* Main Click Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleClick}
            disabled={isPlanting}
            className={`
              w-48 h-48 rounded-full text-2xl font-bold shadow-2xl
              bg-gradient-to-br from-green-500 to-green-700 
              hover:from-green-600 hover:to-green-800
              transform transition-all duration-200
              ${clickAnimation ? "scale-95" : "scale-100 hover:scale-105"}
              ${isPlanting ? "animate-pulse" : ""}
            `}
          >
            <div className="flex flex-col items-center">
              <TreePine className="w-16 h-16 mb-2" />
              {isPlanting ? "Planting..." : "Click Me!"}
            </div>
          </Button>
        </div>

        {/* Forest Display */}
        {trees > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Your Forest</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[...Array(Math.min(trees, 50))].map((_, i) => (
                  <TreePine
                    key={i}
                    className="w-8 h-8 text-green-600 animate-sway"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
                {trees > 50 && <div className="text-green-600 font-medium">+{trees - 50} more trees!</div>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes sway {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
        
        .animate-fall {
          animation: fall linear infinite;
        }
        
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
