"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("@/lib/db");
var User_1 = __importDefault(require("@/models/User"));
var UserActivity_1 = __importDefault(require("@/models/UserActivity"));
var GamificationProfile_1 = __importDefault(require("@/models/GamificationProfile"));
function generateTestData() {
    return __awaiter(this, void 0, void 0, function () {
        var testUser, modules, now, i, date, activitiesCount, j, moduleType, score, duration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.dbConnect)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, User_1.default.create({
                            name: "Test User",
                            email: "test@example.com",
                            password: "hashedpassword", // In real app, this would be hashed
                            role: "user",
                        })];
                case 2:
                    testUser = _a.sent();
                    // Create gamification profile
                    return [4 /*yield*/, GamificationProfile_1.default.create({
                            userId: testUser._id,
                            level: 2,
                            experience: 40,
                            streak: {
                                current: 3,
                                longest: 5,
                            },
                            achievements: ["first_login", "complete_profile"],
                            badges: ["quick_learner"],
                            stats: {
                                totalXP: 150,
                                activeDays: 5,
                                moduleActivity: {
                                    reading: 10,
                                    writing: 8,
                                    speaking: 5,
                                    grammar: 12,
                                    vocabulary: 15,
                                    games: 7,
                                },
                            },
                        })];
                case 3:
                    // Create gamification profile
                    _a.sent();
                    modules = [
                        "reading",
                        "writing",
                        "speaking",
                        "grammar",
                        "vocabulary",
                        "games",
                    ];
                    now = new Date();
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < 30)) return [3 /*break*/, 9];
                    date = new Date(now);
                    date.setDate(date.getDate() - i);
                    activitiesCount = Math.floor(Math.random() * 3) + 1;
                    j = 0;
                    _a.label = 5;
                case 5:
                    if (!(j < activitiesCount)) return [3 /*break*/, 8];
                    moduleType = modules[Math.floor(Math.random() * modules.length)];
                    score = Math.floor(Math.random() * 40) + 60;
                    duration = Math.floor(Math.random() * 20) + 10;
                    return [4 /*yield*/, UserActivity_1.default.create({
                            userId: testUser._id,
                            module: moduleType,
                            activityType: "complete_session",
                            xpEarned: Math.floor(Math.random() * 20) + 10,
                            metadata: {
                                sessionId: "session_".concat(date.getTime(), "_").concat(j),
                                completed: true,
                                score: score,
                                duration: duration * 60, // Convert to seconds
                                itemsCompleted: Math.floor(Math.random() * 10) + 5,
                                wordCount: moduleType === "reading" || moduleType === "writing"
                                    ? Math.floor(Math.random() * 200) + 100
                                    : undefined,
                                accuracy: Math.random() * 0.3 + 0.7, // 70-100% accuracy
                            },
                            createdAt: date,
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    j++;
                    return [3 /*break*/, 5];
                case 8:
                    i++;
                    return [3 /*break*/, 4];
                case 9:
                    console.log("Test data generated successfully!");
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
generateTestData().catch(console.error);
