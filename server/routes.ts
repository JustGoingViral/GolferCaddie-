import { Express, Request, Response, NextFunction, Router } from "express";
import { Server } from "http";
import { setupVite, serveStatic } from "./vite";
import { storage } from "./storage";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { 
  insertUserSchema, 
  insertCourseSchema, 
  insertRoundSchema, 
  insertShotSchema, 
  insertClubSchema,
  insertConnectionSchema,
  insertEventSchema,
  insertEventParticipantSchema,
  insertSponsorOfferSchema,
  insertProGolferSchema,
  insertFantasyLeagueSchema,
  insertFantasyTeamSchema,
  insertTeamRosterSchema
} from "../shared/schema";

export function registerRoutes(app: Express): void {
  // API Routes
  const apiRouter = Router();
  
  // User routes
  apiRouter.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  apiRouter.get("/users/username/:username", async (req: Request, res: Response) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Course routes
  apiRouter.get("/courses", async (req: Request, res: Response) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  apiRouter.get("/courses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  apiRouter.post("/courses", async (req: Request, res: Response) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating course:", error);
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  // Round routes
  apiRouter.get("/rounds/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const rounds = await storage.getRoundsByUser(userId);
      res.json(rounds);
    } catch (error) {
      console.error("Error fetching rounds:", error);
      res.status(500).json({ error: "Failed to fetch rounds" });
    }
  });

  apiRouter.get("/rounds/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const round = await storage.getRound(id);
      
      if (!round) {
        return res.status(404).json({ error: "Round not found" });
      }
      
      res.json(round);
    } catch (error) {
      console.error("Error fetching round:", error);
      res.status(500).json({ error: "Failed to fetch round" });
    }
  });

  apiRouter.post("/rounds", async (req: Request, res: Response) => {
    try {
      const roundData = insertRoundSchema.parse(req.body);
      const round = await storage.createRound(roundData);
      res.status(201).json(round);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating round:", error);
      res.status(500).json({ error: "Failed to create round" });
    }
  });

  apiRouter.patch("/rounds/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const round = await storage.updateRound(id, req.body);
      
      if (!round) {
        return res.status(404).json({ error: "Round not found" });
      }
      
      res.json(round);
    } catch (error) {
      console.error("Error updating round:", error);
      res.status(500).json({ error: "Failed to update round" });
    }
  });

  // Shot routes
  apiRouter.get("/shots/round/:roundId", async (req: Request, res: Response) => {
    try {
      const roundId = parseInt(req.params.roundId);
      const shots = await storage.getShotsByRound(roundId);
      res.json(shots);
    } catch (error) {
      console.error("Error fetching shots:", error);
      res.status(500).json({ error: "Failed to fetch shots" });
    }
  });

  apiRouter.get("/shots/round/:roundId/hole/:holeNumber", async (req: Request, res: Response) => {
    try {
      const roundId = parseInt(req.params.roundId);
      const holeNumber = parseInt(req.params.holeNumber);
      const shots = await storage.getShotsByHole(roundId, holeNumber);
      res.json(shots);
    } catch (error) {
      console.error("Error fetching shots:", error);
      res.status(500).json({ error: "Failed to fetch shots" });
    }
  });

  apiRouter.get("/shots/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const shot = await storage.getShot(id);
      
      if (!shot) {
        return res.status(404).json({ error: "Shot not found" });
      }
      
      res.json(shot);
    } catch (error) {
      console.error("Error fetching shot:", error);
      res.status(500).json({ error: "Failed to fetch shot" });
    }
  });

  apiRouter.post("/shots", async (req: Request, res: Response) => {
    try {
      const shotData = insertShotSchema.parse(req.body);
      const shot = await storage.createShot(shotData);
      res.status(201).json(shot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating shot:", error);
      res.status(500).json({ error: "Failed to create shot" });
    }
  });

  // Club routes
  apiRouter.get("/clubs/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const clubs = await storage.getClubsByUser(userId);
      
      // Sort clubs by type and distance
      clubs.sort((a, b) => {
        const typeOrder: Record<string, number> = {
          driver: 1,
          wood: 2,
          hybrid: 3,
          iron: 4,
          wedge: 5,
          putter: 6
        };
        
        const typeA = typeOrder[a.type as keyof typeof typeOrder] || 999;
        const typeB = typeOrder[b.type as keyof typeof typeOrder] || 999;
        
        if (typeA !== typeB) {
          return typeA - typeB;
        }
        
        // For same type, sort by distance (higher first)
        return (b.averageDistance || 0) - (a.averageDistance || 0);
      });
      
      res.json(clubs);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  apiRouter.get("/clubs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const club = await storage.getClub(id);
      
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      
      res.json(club);
    } catch (error) {
      console.error("Error fetching club:", error);
      res.status(500).json({ error: "Failed to fetch club" });
    }
  });

  apiRouter.post("/clubs", async (req: Request, res: Response) => {
    try {
      const clubData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(clubData);
      res.status(201).json(club);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating club:", error);
      res.status(500).json({ error: "Failed to create club" });
    }
  });

  apiRouter.patch("/clubs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const club = await storage.updateClub(id, req.body);
      
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      
      res.json(club);
    } catch (error) {
      console.error("Error updating club:", error);
      res.status(500).json({ error: "Failed to update club" });
    }
  });

  // Social Connection routes
  apiRouter.get("/connections/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const connections = await storage.getConnectionsByUser(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  });

  apiRouter.post("/connections", async (req: Request, res: Response) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating connection:", error);
      res.status(500).json({ error: "Failed to create connection" });
    }
  });

  apiRouter.patch("/connections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const connection = await storage.updateConnection(id, req.body);
      
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      res.json(connection);
    } catch (error) {
      console.error("Error updating connection:", error);
      res.status(500).json({ error: "Failed to update connection" });
    }
  });

  // Event routes
  apiRouter.get("/events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  apiRouter.get("/events/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await storage.getEventsByUser(userId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  apiRouter.post("/events", async (req: Request, res: Response) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  apiRouter.get("/events/:id/participants", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const participants = await storage.getEventParticipantsByEvent(eventId);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  apiRouter.post("/events/:id/participants", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const participantData = insertEventParticipantSchema.parse({
        ...req.body,
        eventId
      });
      
      const participant = await storage.createEventParticipant(participantData);
      res.status(201).json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating participant:", error);
      res.status(500).json({ error: "Failed to create participant" });
    }
  });

  // Sponsor routes
  apiRouter.get("/sponsors/offers/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const offers = await storage.getSponsorOffersByUser(userId);
      res.json(offers);
    } catch (error) {
      console.error("Error fetching sponsor offers:", error);
      res.status(500).json({ error: "Failed to fetch sponsor offers" });
    }
  });

  apiRouter.post("/sponsors/offers", async (req: Request, res: Response) => {
    try {
      const offerData = insertSponsorOfferSchema.parse(req.body);
      const offer = await storage.createSponsorOffer(offerData);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating sponsor offer:", error);
      res.status(500).json({ error: "Failed to create sponsor offer" });
    }
  });

  // Fantasy Golf routes
  apiRouter.get("/fantasy/golfers", async (req: Request, res: Response) => {
    try {
      const golfers = await storage.getAllProGolfers();
      res.json(golfers);
    } catch (error) {
      console.error("Error fetching pro golfers:", error);
      res.status(500).json({ error: "Failed to fetch pro golfers" });
    }
  });

  apiRouter.post("/fantasy/golfers", async (req: Request, res: Response) => {
    try {
      const golferData = insertProGolferSchema.parse(req.body);
      const golfer = await storage.createProGolfer(golferData);
      res.status(201).json(golfer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating pro golfer:", error);
      res.status(500).json({ error: "Failed to create pro golfer" });
    }
  });

  apiRouter.get("/fantasy/leagues", async (req: Request, res: Response) => {
    try {
      const leagues = await storage.getAllFantasyLeagues();
      res.json(leagues);
    } catch (error) {
      console.error("Error fetching fantasy leagues:", error);
      res.status(500).json({ error: "Failed to fetch fantasy leagues" });
    }
  });

  apiRouter.post("/fantasy/leagues", async (req: Request, res: Response) => {
    try {
      const leagueData = insertFantasyLeagueSchema.parse(req.body);
      const league = await storage.createFantasyLeague(leagueData);
      res.status(201).json(league);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating fantasy league:", error);
      res.status(500).json({ error: "Failed to create fantasy league" });
    }
  });

  apiRouter.get("/fantasy/leagues/:id/teams", async (req: Request, res: Response) => {
    try {
      const leagueId = parseInt(req.params.id);
      const teams = await storage.getTeamsByLeague(leagueId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  apiRouter.get("/fantasy/users/:userId/teams", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const teams = await storage.getTeamsByUser(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  apiRouter.post("/fantasy/teams", async (req: Request, res: Response) => {
    try {
      const teamData = insertFantasyTeamSchema.parse(req.body);
      const team = await storage.createFantasyTeam(teamData);
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating fantasy team:", error);
      res.status(500).json({ error: "Failed to create fantasy team" });
    }
  });

  apiRouter.post("/fantasy/teams/:teamId/roster", async (req: Request, res: Response) => {
    try {
      const teamId = parseInt(req.params.teamId);
      const rosterData = insertTeamRosterSchema.parse({
        ...req.body,
        teamId
      });
      
      const roster = await storage.createTeamRoster(rosterData);
      res.status(201).json(roster);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating team roster:", error);
      res.status(500).json({ error: "Failed to create team roster" });
    }
  });

  // Player matching algorithm endpoint
  apiRouter.get("/match/players", async (req: Request, res: Response) => {
    try {
      const { location, skillLevel, handicap } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: "Location is required" });
      }
      
      // Get all users with location data
      const allUsers = await storage.getAllUsers();
      const matchedUsers = allUsers.filter(user => {
        // Filter by location (simplified for now)
        if (!user.location || !user.location.includes(location as string)) {
          return false;
        }
        
        // Filter by skill level if provided
        if (skillLevel && user.skillLevel !== skillLevel) {
          return false;
        }
        
        // Filter by handicap range if provided
        if (handicap) {
          const targetHandicap = parseInt(handicap as string);
          const userHandicap = user.handicap || 0;
          
          // Allow ±5 handicap range
          if (Math.abs(userHandicap - targetHandicap) > 5) {
            return false;
          }
        }
        
        return true;
      });
      
      res.json(matchedUsers);
    } catch (error) {
      console.error("Error matching players:", error);
      res.status(500).json({ error: "Failed to match players" });
    }
  });

  // Add the API router with prefix
  // AI Chat Routes
  apiRouter.post("/golf-chat", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      
      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1024,
        system: `You are a highly knowledgeable golf assistant with expertise in golf techniques, rules, equipment, and course management. 
        Your name is "GolfPro AI" and you help golfers improve their game with personalized advice.
        Be concise but helpful, and always try to provide actionable tips that golfers can apply immediately.
        If asked about specific golf courses, players, or tournaments, provide factual information.
        If asked about equipment, provide balanced recommendations based on a player's skill level and needs.`,
        messages: [
          { 
            role: 'user', 
            content: message 
          }
        ],
      });
      
      res.json({ response: response.content[0].text });
    } catch (error) {
      console.error('Error in chat API:', error);
      res.status(500).json({ 
        error: 'Failed to get response from AI',
        message: (error as any).message 
      });
    }
  });

  app.use("/api", apiRouter);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  });

  // No need to return a server, as it's created in index.ts
  // Just register all the routes above
  
  return;
}