import {
  PawPrint,
  Bird,
  Origami,
  Gamepad,
  Flower,
  Plane,
  Hamburger,
  Candy,
  Book,
  Music,
  Paintbrush,
  Trophy,
  Star,
  Gem,
  Target,
  Rocket,
  Crown,
  Medal,
  Tv2,
  Film,
  Sparkles,
  Heart,
  Fan,
  Siren,
  HandHelping,
  Youtube,
  Coins
} from "lucide-react";
import { Flame } from "lucide-react"

export const iconOptions = [
  { id: "pawprint", Icon: PawPrint },
  { id: "bird", Icon: Bird },
  { id: "origami", Icon: Origami },
  { id: "gamepad", Icon: Gamepad },
  { id: "flower", Icon: Flower },
  { id: "plane", Icon: Plane },
  { id: "hamburger", Icon: Hamburger },
];

export const rewardIconOptions = [
  { id: "gamepad", Icon: Gamepad },
  { id: "candy", Icon: Candy },
  { id: "tv", Icon: Tv2 },
  { id: "hamburger", Icon: Hamburger },
  { id: "film", Icon: Film },
  { id: "paint", Icon: Paintbrush },
  { id: "book", Icon: Book },
  { id: "music", Icon: Music },
  { id: "sparkles", Icon: Sparkles },
  { id: "heart", Icon: Heart },
  { id: "youtube", Icon: Youtube },
  { id: "cins", Icon: Coins },
]

export const badgeIconOptions = [
  { id: "fire", Icon: Flame },
  { id: "trophy", Icon: Trophy },
  { id: "book", Icon: Book },
  { id: "star", Icon: Star },
  { id: "gem", Icon: Gem },
  { id: "target", Icon: Target },
  { id: "rocket", Icon: Rocket },
  { id: "crown", Icon: Crown },
  { id: "medal", Icon: Medal },
  { id: "fan", Icon: Fan }, 
  { id: "siren", Icon: Siren },
  { id: "handHelping", Icon: HandHelping },
]

export const colorThemes = [
  { 
    name: "ブルー", 
    value: "blue", 
    gradient: "from-blue-400 to-blue-600", 
    bg: "bg-blue-100", 
    text: "text-blue-800" 
  },
  { 
    name: "ピンク", 
    value: "pink", 
    gradient: "from-pink-400 to-pink-600", 
    bg: "bg-pink-100", 
    text: "text-pink-800" },
  {
    name: "グリーン",
    value: "green",
    gradient: "from-green-400 to-green-600",
    bg: "bg-green-100",
    text: "text-green-800",
  },
  {
    name: "パープル",
    value: "purple",
    gradient: "from-purple-400 to-purple-600",
    bg: "bg-purple-100",
    text: "text-purple-800",
  },
  {
    name: "オレンジ",
    value: "orange",
    gradient: "from-orange-400 to-orange-600",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  { 
    name: "レッド", 
    value: "red", 
    gradient: "from-red-400 to-red-600", 
    bg: "bg-red-100", 
    text: "text-red-800" 
  },
  {
    name: "イエロー",
    value: "yellow",
    gradient: "from-yellow-400 to-yellow-600",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  {
    name: "インディゴ",
    value: "indigo",
    gradient: "from-indigo-400 to-indigo-600",
    bg: "bg-indigo-100",
    text: "text-indigo-800",
  },
]