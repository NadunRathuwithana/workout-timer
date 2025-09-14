"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Clock,
  CheckCircle,
  Circle,
  Dumbbell,
  Timer,
  RotateCcw,
  Check,
  ArrowRight,
  Calendar,
  Target,
  Zap,
} from "lucide-react";

// Workout Plan Data
const workoutData = {
  daily_workout: [
    {
      day: "Day 1 & 4",
      focus: "Chest + Triceps",
      exercises: [
        { name: "Push-ups", sets: 4, duration_sec: 40, rest_sec: 20 },
        { name: "Wide push-ups", sets: 3, duration_sec: 40, rest_sec: 20 },
        { name: "Diamond push-ups", sets: 3, duration_sec: 40, rest_sec: 20 },
        {
          name: "Decline push-ups (feet on chair/bed)",
          sets: 3,
          duration_sec: 40,
          rest_sec: 20,
        },
        {
          name: "Triceps dips on chair/bed",
          sets: 4,
          duration_sec: 40,
          rest_sec: 20,
        },
      ],
      estimated_total_min: 17,
    },
    {
      day: "Day 2 & 5",
      focus: "Shoulders + Biceps",
      exercises: [
        { name: "Pike push-ups", sets: 4, duration_sec: 40, rest_sec: 20 },
        {
          name: "Decline pike push-ups",
          sets: 3,
          duration_sec: 40,
          rest_sec: 20,
        },
        {
          name: "Wall handstand hold",
          sets: 3,
          duration_sec: 30,
          rest_sec: 20,
        },
        {
          name: "Isometric bicep squeeze",
          sets: 3,
          duration_sec: 30,
          rest_sec: 15,
        },
        { name: "Backpack curls", sets: 4, duration_sec: 40, rest_sec: 20 },
        {
          name: "Backpack hammer curls",
          sets: 3,
          duration_sec: 40,
          rest_sec: 20,
        },
      ],
      estimated_total_min: 18,
    },
    {
      day: "Day 3",
      focus: "Chest + Shoulders Pump",
      exercises: [
        { name: "Push-ups", sets: 3, duration_sec: 40, rest_sec: 20 },
        {
          name: "Explosive clap push-ups",
          sets: 3,
          duration_sec: 40,
          rest_sec: 20,
        },
        {
          name: "Pseudo planche push-ups",
          sets: 3,
          duration_sec: 40,
          rest_sec: 20,
        },
        {
          name: "Lateral raises with water bottles",
          sets: 4,
          duration_sec: 40,
          rest_sec: 20,
        },
        {
          name: "Front raises with water bottles",
          sets: 3,
          duration_sec: 40,
          rest_sec: 20,
        },
      ],
      estimated_total_min: 16,
    },
    {
      day: "Pump and Flex",
      focus: "Pump & Flex",
      exercises: [
        {
          name: "Push-ups (slow & controlled)",
          sets: 5,
          duration_sec: 40,
          rest_sec: 20,
        },
        { name: "Diamond push-ups", sets: 3, duration_sec: 40, rest_sec: 20 },
        { name: "Pike push-ups", sets: 3, duration_sec: 40, rest_sec: 20 },
        { name: "Chair dips", sets: 3, duration_sec: 40, rest_sec: 20 },
        { name: "Flex/pose routine", sets: 1, duration_sec: 180, rest_sec: 0 },
      ],
      estimated_total_min: 18,
    },
  ],
  food_strategy: {
    protein_carbs_meals: ["eggs + rice", "chicken + bread", "tuna + potatoes"],
    carbs_before_workout: "1 hour",
    cut_salt_junk: "2–3 days before Pump Day",
    hydration: "Hydrate well, reduce slightly night before Pump Day",
  },
  recovery: {
    sleep_hours: "7-8",
    stretch: ["chest", "shoulders", "arms"],
  },
  pump_day: {
    exercises: [
      { name: "Push-ups", sets: 3, reps: 20 },
      { name: "Diamond push-ups", sets: 3, reps: 10 },
      { name: "Pike push-ups", sets: 3, reps: 10 },
      { name: "Chair dips", sets: 3, reps: 20 },
    ],
  },
};

// Helper: get workout day display name
function getWorkoutDayDisplay(dayNumber: number): string {
  if (dayNumber === 6) return "Pump and Flex";
  return `Day ${dayNumber}`;
}

// Helper: get workout data for a specific day
function getWorkoutForDay(day: string) {
  if (!day) return null;

  const dayNumber = parseInt(day.split(" ")[1]);

  // Map day numbers to workout data
  if (dayNumber === 1 || dayNumber === 4) {
    return workoutData.daily_workout[0]; // Day 1 & 4
  } else if (dayNumber === 2 || dayNumber === 5) {
    return workoutData.daily_workout[1]; // Day 2 & 5
  } else if (dayNumber === 3) {
    return workoutData.daily_workout[2]; // Day 3
  } else if (dayNumber === 6) {
    return workoutData.daily_workout[3]; // Pump and Flex
  }

  return null;
}

export default function WorkoutApp() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "ready" | "work" | "rest" | "done"
  >("idle");
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set()
  );
  const [showWorkout, setShowWorkout] = useState(false);

  // Update workout when day changes
  useEffect(() => {
    if (selectedDay) {
      setCurrentExercise(0);
      setCurrentSet(0);
      setStatus("idle");
      setCompletedExercises(new Set());
      setShowWorkout(false);
    }
  }, [selectedDay]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 || status === "idle" || status === "done") return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  // Handle phase transitions
  useEffect(() => {
    if (timeLeft === 0 && status !== "idle") {
      const workout = getWorkoutForDay(`Day ${selectedDay}`);
      if (!workout) return;

      const currentExerciseData = workout.exercises[currentExercise];
      if (!currentExerciseData) return;

      if (status === "ready") {
        setStatus("work");
        setTimeLeft(currentExerciseData.duration_sec);
      } else if (status === "work") {
        // Check if we've completed all sets for this exercise
        if (currentSet < currentExerciseData.sets - 1) {
          // Move to next set
          setCurrentSet(currentSet + 1);
          setStatus("rest");
          setTimeLeft(currentExerciseData.rest_sec);
        } else {
          // All sets completed for this exercise
          setCompletedExercises((prev) => new Set([...prev, currentExercise]));

          // Check if we have more exercises
          if (currentExercise < workout.exercises.length - 1) {
            // Move to next exercise and start rest
            setCurrentExercise(currentExercise + 1);
            setCurrentSet(0);
            setStatus("rest");
            setTimeLeft(workout.exercises[currentExercise + 1]?.rest_sec || 20);
          } else {
            // All exercises completed
            setStatus("done");
          }
        }
      } else if (status === "rest") {
        // After rest, either start next set or next exercise
        if (currentSet < currentExerciseData.sets - 1) {
          // Start next set of current exercise - go directly to work
          setStatus("work");
          setTimeLeft(currentExerciseData.duration_sec);
        } else {
          // This is rest after completing all sets of an exercise
          // The next exercise should already be set, so start working
          const nextExercise = workout.exercises[currentExercise];
          if (nextExercise) {
            setStatus("work");
            setTimeLeft(nextExercise.duration_sec);
          } else {
            setStatus("done");
          }
        }
      }
    }
  }, [timeLeft, status, currentExercise, currentSet, selectedDay]);

  const startWorkout = () => {
    setCurrentExercise(0);
    setCurrentSet(0);
    setStatus("ready");
    setTimeLeft(30);
    setShowWorkout(true);
    setCompletedExercises(new Set());
  };

  const resetWorkout = () => {
    setShowWorkout(false);
    setStatus("idle");
    setCurrentExercise(0);
    setCurrentSet(0);
    setCompletedExercises(new Set());
  };

  // Show workout list selection
  if (!showWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-4xl font-bold">Pump Workout</h1>
            </div>
            <p className="text-gray-400 text-lg">Choose your workout day</p>
          </div>

          {/* Day Selection Grid */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((dayNum) => {
              const workout = getWorkoutForDay(`Day ${dayNum}`);
              if (!workout) return null;

              return (
                <div
                  key={dayNum}
                  className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedDay === dayNum ? "ring-2 ring-orange-500 rounded-2xl" : ""
                  }`}
                  onClick={() => setSelectedDay(dayNum)}
                >
                  <div
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedDay === dayNum
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-gray-800 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{workout.day}</h3>
                      <Target className="w-6 h-6" />
                    </div>
                    <p className="text-sm opacity-80 mb-3">{workout.focus}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {workout.estimated_total_min} min
                      </span>
                      <span className="flex items-center">
                        <Dumbbell className="w-4 h-4 mr-1" />
                        {workout.exercises.length} exercises
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Start Workout Button */}
          {selectedDay && (
            <div className="text-center">
              <button
                onClick={startWorkout}
                className="group bg-gradient-to-r cursor-pointer from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-102 shadow-lg hover:shadow-xl flex items-center mx-auto"
              >
                Start Workout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show fullscreen workout timer
  const workout = getWorkoutForDay(`Day ${selectedDay}`);
  if (!workout) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm border-b border-gray-700 h-16">
        <div className="flex items-center justify-between p-4 h-full">
          <div className="flex items-center">
            <button
              onClick={resetWorkout}
              className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer mr-6"
            >
              <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
              Back
            </button>
            <div>
              <h2 className="text-xl font-bold">{workout.day}</h2>
              <p className="text-sm text-gray-400">{workout.focus}</p>
            </div>
          </div>
          <div className="text-right flex gap-6 items-center justify-end">
            {status === "work" && (
              <div className="">
                <div className="text-lg font-bold text-orange-400">
                  Set {currentSet + 1} /{" "}
                  {workout.exercises[currentExercise]?.sets}
                </div>
                <div className="text-xs text-gray-400">Current Set</div>
              </div>
            )}
            <div className="text-2xl font-bold">
              {currentExercise + 1} / {workout.exercises.length}
              <div className="text-sm font-medium text-gray-400">Exercise</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex items-center justify-center min-h-screen pt-16 pr-72">
        <div className="text-center">
          {/* Status */}
          <div className="mb-8">
            {status === "ready" && (
              <div className="flex items-center justify-center text-3xl font-bold text-orange-400">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  GET READY
                </span>
              </div>
            )}
            {status === "work" && (
              <div className="flex items-center justify-center text-3xl font-bold text-red-400">
                <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  WORK
                </span>
              </div>
            )}
            {status === "rest" && (
              <div className="flex items-center justify-center text-3xl font-bold text-blue-400">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  REST
                </span>
              </div>
            )}
          </div>

          {/* Exercise Name */}
          <div className="mb-8">
            <h3 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-fade-in">
              {workout.exercises[currentExercise]?.name}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Timer Circle */}
          <div className="relative w-96 h-96 mx-auto mb-8">
            {/* Main Timer Circle */}
            <div className="relative w-full h-full">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-gray-600/30"
                />

                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${
                    status === "work"
                      ? "text-red-500"
                      : status === "rest"
                      ? "text-blue-500"
                      : "text-orange-500"
                  }`}
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    45 *
                    (1 -
                      timeLeft /
                        (workout.exercises[currentExercise]?.duration_sec ||
                          workout.exercises[currentExercise]?.rest_sec ||
                          40))
                  }`}
                />
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={`text-8xl font-bold mb-2 ${
                    status === "work"
                      ? "text-red-400"
                      : status === "rest"
                      ? "text-blue-400"
                      : "text-orange-400"
                  }`}
                >
                  {timeLeft}
                </div>
                <div className="text-lg font-semibold text-gray-300 uppercase tracking-wider">
                  {status === "work"
                    ? "seconds"
                    : status === "rest"
                    ? "rest"
                    : "ready"}
                </div>
              </div>
            </div>
          </div>

          {/* Exercise Details */}
          <div className="text-2xl font-bold text-gray-200">
            {status === "work" && (
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30">
                  <span className="text-red-300">
                    Set {currentSet + 1} of{" "}
                    {workout.exercises[currentExercise]?.sets}
                  </span>
                </div>
                <div className="text-gray-400">×</div>
                <div className="bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30">
                  <span className="text-orange-300">
                    {workout.exercises[currentExercise]?.duration_sec}s
                  </span>
                </div>
              </div>
            )}
            {status === "rest" && (
              <div className="bg-blue-500/20 px-6 py-3 rounded-full border border-blue-500/30 inline-block">
                <span className="text-blue-300">
                  Rest {workout.exercises[currentExercise]?.rest_sec}s
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Workout List */}
      <div className="absolute top-16 right-0 w-72 h-[calc(100vh-4rem)] bg-black/30 backdrop-blur-sm border-l border-gray-700 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            Workout List
          </h3>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => {
              const isCompleted = completedExercises.has(index);
              const isCurrent = index === currentExercise;
              const currentSetForExercise = isCurrent ? currentSet : 0;

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : isCurrent
                      ? "bg-orange-500/20 border-orange-500 text-orange-400"
                      : "bg-gray-800 border-gray-700 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 mr-3" />
                      )}
                      <span className="font-medium">{exercise.name}</span>
                    </div>
                    <div className="text-sm opacity-75">
                      {exercise.sets}×{exercise.duration_sec}s
                    </div>
                  </div>

                  {/* Set Progress */}
                  {isCurrent && !isCompleted && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {currentSetForExercise + 1} / {exercise.sets}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              ((currentSetForExercise + 1) / exercise.sets) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Screen */}
      {status === "done" && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold mb-4">Workout Complete!</h2>
            <p className="text-xl text-gray-400 mb-8">
              Great job! You've finished all exercises.
            </p>
            <button
              onClick={resetWorkout}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors"
            >
              Start New Workout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
