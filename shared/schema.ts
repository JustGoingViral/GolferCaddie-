import { pgTable, text, serial, integer, json, boolean, timestamp, varchar, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with enhanced profile information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  location: text("location"),
  skillLevel: text("skill_level"), // "Beginner", "Amateur", "Pro", etc.
  handicap: integer("handicap"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  linkedinId: text("linkedin_id"),
  linkedinUrl: text("linkedin_url"),
  interests: json("interests").default({}), // Array of interests for better matching
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  location: true,
  skillLevel: true,
  handicap: true,
  bio: true,
  profileImage: true,
  linkedinId: true,
  linkedinUrl: true,
  interests: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Golf Course schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  holes: integer("holes").default(18),
  data: json("data").notNull(), // Contains hole details (par, distance, etc.)
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  name: true,
  location: true,
  holes: true,
  data: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Golf Round schema
export const rounds = pgTable("rounds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  date: text("date").notNull(),
  completed: boolean("completed").default(false),
  currentHole: integer("current_hole").default(1),
  scores: json("scores").notNull(), // Array of scores for each hole
  stats: json("stats").notNull(), // Additional stats like putts, fairways hit, etc.
});

export const insertRoundSchema = createInsertSchema(rounds).pick({
  userId: true,
  courseId: true,
  date: true,
  completed: true,
  currentHole: true,
  scores: true,
  stats: true,
});

export type InsertRound = z.infer<typeof insertRoundSchema>;
export type Round = typeof rounds.$inferSelect;

// Shot schema
export const shots = pgTable("shots", {
  id: serial("id").primaryKey(),
  roundId: integer("round_id").notNull(),
  holeNumber: integer("hole_number").notNull(),
  shotNumber: integer("shot_number").notNull(),
  club: text("club").notNull(),
  distance: integer("distance"),
  startPosition: json("start_position").notNull(), // {x, y} coordinates
  endPosition: json("end_position").notNull(), // {x, y} coordinates
  result: text("result"), // fairway, green, rough, sand, water, etc.
  quality: text("quality"), // poor, ok, great
  notes: text("notes"),
});

export const insertShotSchema = createInsertSchema(shots).pick({
  roundId: true,
  holeNumber: true,
  shotNumber: true,
  club: true,
  distance: true,
  startPosition: true,
  endPosition: true,
  result: true,
  quality: true,
  notes: true,
});

export type InsertShot = z.infer<typeof insertShotSchema>;
export type Shot = typeof shots.$inferSelect;

// Club schema
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // driver, wood, iron, wedge, putter
  averageDistance: integer("average_distance"),
  confidence: integer("confidence").default(3), // 1-5 scale
});

export const insertClubSchema = createInsertSchema(clubs).pick({
  userId: true,
  name: true,
  type: true,
  averageDistance: true,
  confidence: true,
});

export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = typeof clubs.$inferSelect;

// Friend connections table
export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status").notNull(), // "pending", "accepted", "declined"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConnectionSchema = createInsertSchema(connections).pick({
  userId: true,
  friendId: true,
  status: true,
});

export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connections.$inferSelect;

// Events table for organizing games
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  hostId: integer("host_id").notNull(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  startTime: text("start_time"),
  maxPlayers: integer("max_players").default(4),
  skillLevel: text("skill_level"), // Preferred skill level
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  hostId: true,
  courseId: true,
  title: true,
  description: true,
  eventDate: true,
  startTime: true,
  maxPlayers: true,
  skillLevel: true,
  isPrivate: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Event participants
export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(), // "invited", "confirmed", "declined"
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants).pick({
  eventId: true,
  userId: true,
  status: true,
});

export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type EventParticipant = typeof eventParticipants.$inferSelect;

// Sponsor offers for users
export const sponsorOffers = pgTable("sponsor_offers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sponsorName: text("sponsor_name").notNull(),
  offerText: text("offer_text").notNull(),
  url: text("url"),
  amount: text("amount"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  status: text("status").default("active"), // "active", "claimed", "expired"
});

export const insertSponsorOfferSchema = createInsertSchema(sponsorOffers).pick({
  userId: true,
  sponsorName: true,
  offerText: true,
  url: true,
  amount: true,
  expiresAt: true,
  status: true,
});

export type InsertSponsorOffer = z.infer<typeof insertSponsorOfferSchema>;
export type SponsorOffer = typeof sponsorOffers.$inferSelect;

// Fantasy Golf - Pro Golfers Table
export const proGolfers = pgTable("pro_golfers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rank: integer("rank"),
  tourAverage: integer("tour_average"), // Average score relative to par
  drivingDistance: integer("driving_distance"), // In yards
  drivingAccuracy: integer("driving_accuracy"), // Percentage
  greensInRegulation: integer("greens_in_regulation"), // Percentage
  puttingAverage: integer("putting_average"), // Average putts per round
  sandSaves: integer("sand_saves"), // Percentage
  scoreAverage: integer("score_average"), // Average score
  majorWins: integer("major_wins"),
  tourWins: integer("tour_wins"),
  profileImage: text("profile_image"),
  bio: text("bio"),
  status: text("status").default("active"), // "active", "inactive"
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProGolferSchema = createInsertSchema(proGolfers).pick({
  name: true,
  rank: true,
  tourAverage: true,
  drivingDistance: true,
  drivingAccuracy: true,
  greensInRegulation: true,
  puttingAverage: true,
  sandSaves: true,
  scoreAverage: true,
  majorWins: true,
  tourWins: true,
  profileImage: true,
  bio: true,
  status: true,
});

export type InsertProGolfer = z.infer<typeof insertProGolferSchema>;
export type ProGolfer = typeof proGolfers.$inferSelect;

// Fantasy Golf - Leagues
export const fantasyLeagues = pgTable("fantasy_leagues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  creatorId: integer("creator_id").notNull(),
  seasonStart: timestamp("season_start").notNull(),
  seasonEnd: timestamp("season_end").notNull(),
  maxTeams: integer("max_teams").default(10),
  isPrivate: boolean("is_private").default(false),
  entryCode: text("entry_code"), // For private leagues
  scoringSystem: json("scoring_system").notNull(), // JSON with scoring rules
  status: text("status").default("active"), // "active", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFantasyLeagueSchema = createInsertSchema(fantasyLeagues).pick({
  name: true,
  description: true,
  creatorId: true,
  seasonStart: true,
  seasonEnd: true,
  maxTeams: true,
  isPrivate: true,
  entryCode: true,
  scoringSystem: true,
  status: true,
});

export type InsertFantasyLeague = z.infer<typeof insertFantasyLeagueSchema>;
export type FantasyLeague = typeof fantasyLeagues.$inferSelect;

// Fantasy Golf - Teams
export const fantasyTeams = pgTable("fantasy_teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull(),
  leagueId: integer("league_id").notNull(),
  logo: text("logo"),
  totalPoints: integer("total_points").default(0),
  rank: integer("rank"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFantasyTeamSchema = createInsertSchema(fantasyTeams).pick({
  name: true,
  userId: true,
  leagueId: true,
  logo: true,
});

export type InsertFantasyTeam = z.infer<typeof insertFantasyTeamSchema>;
export type FantasyTeam = typeof fantasyTeams.$inferSelect;

// Fantasy Golf - Team Roster (which pro golfers are on a team)
export const teamRosters = pgTable("team_rosters", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  golferOneId: integer("golfer_one_id").notNull(),
  golferTwoId: integer("golfer_two_id").notNull(),
  golferThreeId: integer("golfer_three_id").notNull(),
  golferFourId: integer("golfer_four_id").notNull(),
  golferFiveId: integer("golfer_five_id"),
  golferSixId: integer("golfer_six_id"),
  activeRoster: json("active_roster").notNull(), // Array of active golfer IDs for the current tournament
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTeamRosterSchema = createInsertSchema(teamRosters).pick({
  teamId: true,
  golferOneId: true,
  golferTwoId: true,
  golferThreeId: true,
  golferFourId: true,
  golferFiveId: true,
  golferSixId: true,
  activeRoster: true,
});

export type InsertTeamRoster = z.infer<typeof insertTeamRosterSchema>;
export type TeamRoster = typeof teamRosters.$inferSelect;

// Fantasy Golf - Tournaments (tracks real pro tournaments)
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  courseId: integer("course_id"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  par: integer("par").notNull(),
  purse: text("purse"),
  status: text("status").default("upcoming"), // "upcoming", "in-progress", "completed"
  leaderboard: json("leaderboard").default({}), // Current or final standings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).pick({
  name: true,
  location: true,
  courseId: true,
  startDate: true,
  endDate: true,
  par: true,
  purse: true,
  status: true,
  leaderboard: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

// Fantasy Golf - Tournament Results (tracks golfer performance)
export const tournamentResults = pgTable("tournament_results", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  golferId: integer("golfer_id").notNull(),
  round1: integer("round1"),
  round2: integer("round2"),
  round3: integer("round3"),
  round4: integer("round4"),
  totalScore: integer("total_score"),
  relativeToPar: integer("relative_to_par"),
  position: integer("position"),
  status: text("status").default("active"), // "active", "cut", "withdrawn", "disqualified"
  fantasyPoints: integer("fantasy_points").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTournamentResultSchema = createInsertSchema(tournamentResults).pick({
  tournamentId: true,
  golferId: true,
  round1: true,
  round2: true,
  round3: true,
  round4: true,
  totalScore: true,
  relativeToPar: true,
  position: true,
  status: true,
  fantasyPoints: true,
});

export type InsertTournamentResult = z.infer<typeof insertTournamentResultSchema>;
export type TournamentResult = typeof tournamentResults.$inferSelect;

// Fantasy Golf - Performance Simulations
export const playerSimulations = pgTable("player_simulations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  golferId: integer("golfer_id").notNull(),
  courseId: integer("course_id").notNull(),
  simulatedScore: integer("simulated_score"),
  relativeToPar: integer("relative_to_par"),
  drivingAccuracy: integer("driving_accuracy"), // Percentage
  greensInRegulation: integer("greens_in_regulation"), // Percentage
  puttingAverage: integer("putting_average"), // Average putts per round
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlayerSimulationSchema = createInsertSchema(playerSimulations).pick({
  userId: true,
  golferId: true,
  courseId: true,
  simulatedScore: true,
  relativeToPar: true,
  drivingAccuracy: true,
  greensInRegulation: true,
  puttingAverage: true,
  notes: true,
});

export type InsertPlayerSimulation = z.infer<typeof insertPlayerSimulationSchema>;
export type PlayerSimulation = typeof playerSimulations.$inferSelect;

// Type definitions for frontend use
export type Position = {
  x: number;
  y: number;
};

export type HoleData = {
  number: number;
  par: number;
  distance: number;
  hcp: number; // handicap index
  teePosition: Position;
  holePosition: Position;
  hazards?: Array<{
    type: string; // water, sand, rough
    position: Position;
    size: { width: number; height: number };
    shape: string; // circle, rectangle, polygon
  }>;
};

export type CourseData = {
  holes: HoleData[];
};

export type ShotResult = 
  | 'fairway'
  | 'green'
  | 'rough'
  | 'sand'
  | 'water'
  | 'ob'; // out of bounds

export type ShotQuality = 
  | 'poor'
  | 'ok'
  | 'great';

export type ClubType = 
  | 'driver'
  | 'wood'
  | 'hybrid'
  | 'iron'
  | 'wedge'
  | 'putter';
