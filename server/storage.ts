import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  rounds, type Round, type InsertRound,
  shots, type Shot, type InsertShot,
  clubs, type Club, type InsertClub,
  CourseData, HoleData
} from "@shared/schema";
import { db } from './db';
import { eq, and } from 'drizzle-orm';

// Default course data
const defaultCourseData: CourseData = {
  holes: Array.from({ length: 18 }, (_, i) => ({
    number: i + 1,
    par: i % 3 === 0 ? 5 : i % 3 === 1 ? 4 : 3,
    distance: i % 3 === 0 ? 520 + (i * 5) : i % 3 === 1 ? 410 + (i * 3) : 180 + (i * 2),
    hcp: (i + 1) % 18,
    teePosition: { x: 10, y: 85 },
    holePosition: { x: 80, y: 25 },
    hazards: [
      {
        type: 'water',
        position: { x: 30, y: 60 },
        size: { width: 30, height: 15 },
        shape: 'rectangle'
      },
      {
        type: 'sand',
        position: { x: 65, y: 35 },
        size: { width: 10, height: 10 },
        shape: 'circle'
      }
    ]
  }))
};

// Default clubs data
const defaultClubs = [
  { name: 'Driver', type: 'driver', averageDistance: 250, confidence: 3 },
  { name: '3 Wood', type: 'wood', averageDistance: 230, confidence: 3 },
  { name: '5 Wood', type: 'wood', averageDistance: 210, confidence: 2 },
  { name: '3 Hybrid', type: 'hybrid', averageDistance: 215, confidence: 4 },
  { name: '4 Hybrid', type: 'hybrid', averageDistance: 200, confidence: 3 },
  { name: '4 Iron', type: 'iron', averageDistance: 190, confidence: 3 },
  { name: '5 Iron', type: 'iron', averageDistance: 180, confidence: 3 },
  { name: '6 Iron', type: 'iron', averageDistance: 170, confidence: 4 },
  { name: '7 Iron', type: 'iron', averageDistance: 160, confidence: 4 },
  { name: '8 Iron', type: 'iron', averageDistance: 150, confidence: 5 },
  { name: '9 Iron', type: 'iron', averageDistance: 135, confidence: 4 },
  { name: 'PW', type: 'wedge', averageDistance: 120, confidence: 4 },
  { name: 'GW', type: 'wedge', averageDistance: 100, confidence: 3 },
  { name: 'SW', type: 'wedge', averageDistance: 80, confidence: 3 },
  { name: 'LW', type: 'wedge', averageDistance: 60, confidence: 2 },
  { name: 'Putter', type: 'putter', averageDistance: 0, confidence: 4 },
];

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Round methods
  getRound(id: number): Promise<Round | undefined>;
  getRoundsByUser(userId: number): Promise<Round[]>;
  createRound(round: InsertRound): Promise<Round>;
  updateRound(id: number, data: Partial<Round>): Promise<Round | undefined>;

  // Shot methods
  getShot(id: number): Promise<Shot | undefined>;
  getShotsByRound(roundId: number): Promise<Shot[]>;
  getShotsByHole(roundId: number, holeNumber: number): Promise<Shot[]>;
  createShot(shot: InsertShot): Promise<Shot>;

  // Club methods
  getClub(id: number): Promise<Club | undefined>;
  getClubsByUser(userId: number): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, data: Partial<Club>): Promise<Club | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize the database with a default course if it doesn't exist
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      // Check if we already have a course
      const existingCourses = await db.select().from(courses);
      
      if (existingCourses.length === 0) {
        // Create a default course
        await db.insert(courses).values({
          name: "Pine Valley Golf Club",
          location: "Pine Valley, NJ",
          holes: 18,
          data: defaultCourseData
        });
      }
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    const user = result[0];
    
    // Create default clubs for the new user
    for (const club of defaultClubs) {
      await this.createClub({
        userId: user.id,
        name: club.name,
        type: club.type as any,
        averageDistance: club.averageDistance || null,
        confidence: club.confidence || null
      });
    }
    
    return user;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id));
    return result[0];
  }

  async getAllCourses(): Promise<Course[]> {
    return db.select().from(courses);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    // Ensure location and holes are not undefined
    const courseData = {
      ...insertCourse,
      location: insertCourse.location || null,
      holes: insertCourse.holes || null
    };
    const result = await db.insert(courses).values(courseData).returning();
    return result[0];
  }

  // Round methods
  async getRound(id: number): Promise<Round | undefined> {
    const result = await db.select().from(rounds).where(eq(rounds.id, id));
    return result[0];
  }

  async getRoundsByUser(userId: number): Promise<Round[]> {
    return db.select().from(rounds).where(eq(rounds.userId, userId));
  }

  async createRound(insertRound: InsertRound): Promise<Round> {
    // Ensure required fields are not undefined
    const roundData = {
      ...insertRound,
      completed: insertRound.completed || null,
      currentHole: insertRound.currentHole || null
    };
    const result = await db.insert(rounds).values(roundData).returning();
    return result[0];
  }

  async updateRound(id: number, data: Partial<Round>): Promise<Round | undefined> {
    const result = await db.update(rounds)
      .set(data)
      .where(eq(rounds.id, id))
      .returning();
    
    return result[0];
  }

  // Shot methods
  async getShot(id: number): Promise<Shot | undefined> {
    const result = await db.select().from(shots).where(eq(shots.id, id));
    return result[0];
  }

  async getShotsByRound(roundId: number): Promise<Shot[]> {
    return db.select().from(shots).where(eq(shots.roundId, roundId));
  }

  async getShotsByHole(roundId: number, holeNumber: number): Promise<Shot[]> {
    return db.select()
      .from(shots)
      .where(
        and(
          eq(shots.roundId, roundId),
          eq(shots.holeNumber, holeNumber)
        )
      );
  }

  async createShot(insertShot: InsertShot): Promise<Shot> {
    // Ensure required fields are not undefined
    const shotData = {
      ...insertShot,
      distance: insertShot.distance || null,
      result: insertShot.result || null,
      quality: insertShot.quality || null,
      notes: insertShot.notes || null
    };
    const result = await db.insert(shots).values(shotData).returning();
    return result[0];
  }

  // Club methods
  async getClub(id: number): Promise<Club | undefined> {
    const result = await db.select().from(clubs).where(eq(clubs.id, id));
    return result[0];
  }

  async getClubsByUser(userId: number): Promise<Club[]> {
    return db.select().from(clubs).where(eq(clubs.userId, userId));
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    // Ensure required fields are not undefined
    const clubData = {
      ...insertClub,
      averageDistance: insertClub.averageDistance || null,
      confidence: insertClub.confidence || null
    };
    const result = await db.insert(clubs).values(clubData).returning();
    return result[0];
  }

  async updateClub(id: number, data: Partial<Club>): Promise<Club | undefined> {
    const result = await db.update(clubs)
      .set(data)
      .where(eq(clubs.id, id))
      .returning();
    
    return result[0];
  }
}

export const storage = new DatabaseStorage();