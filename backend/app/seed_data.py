"""
Seed Data Module — Member 5's Stakeholder Mapping + Sample Problems

This creates realistic demo data for the prototype.
"""

from .database import SessionLocal
from .models import (
    User, Problem, Organization, StakeholderMapping,
    Confirmation, SolverAdoption
)
from .ai_module import analyze_problem
from .priority import calculate_priority
from datetime import datetime, timezone, timedelta
import random


def seed_database():
    """Seed the database with sample data."""
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping.")
            return
        
        print("Seeding database...")
        
        # === 1. STAKEHOLDER MAPPINGS (Member 5's data) ===
        mappings = [
            StakeholderMapping(
                category="Water Management / Infrastructure",
                govt_body="Local/Municipal Authority, Jal Board",
                university_expertise=["Civil Engineering", "Environmental Engineering"],
                startup_type="WaterTech",
                ngo_type="Environment & Water Conservation",
                solution_path="Assessment → Prototype/Pilot → Implementation"
            ),
            StakeholderMapping(
                category="Healthcare / Public Health",
                govt_body="Health Department, District Medical Officer",
                university_expertise=["Medical Science", "Public Health", "Biotechnology"],
                startup_type="HealthTech",
                ngo_type="Community Health & Wellness",
                solution_path="Survey → Pilot Program → Referral System"
            ),
            StakeholderMapping(
                category="Education / Skill Development",
                govt_body="Education Department, District Education Officer",
                university_expertise=["Education", "Computer Science", "Social Sciences"],
                startup_type="EdTech",
                ngo_type="Education & Literacy",
                solution_path="Needs Assessment → Curriculum Design → Pilot"
            ),
            StakeholderMapping(
                category="Road / Transport Infrastructure",
                govt_body="PWD, Municipal Corporation, NHAI",
                university_expertise=["Civil Engineering", "Urban Planning", "Transportation"],
                startup_type="InfraTech / Smart Mobility",
                ngo_type="Urban Development",
                solution_path="Survey → Design → Prototype → Authority Handoff"
            ),
            StakeholderMapping(
                category="Agriculture / Rural Development",
                govt_body="Agriculture Department, Block Development Office",
                university_expertise=["Agriculture", "Soil Science", "Rural Management"],
                startup_type="AgriTech",
                ngo_type="Rural Development & Livelihoods",
                solution_path="Field Assessment → Testing → Pilot Implementation"
            ),
            StakeholderMapping(
                category="Electricity / Energy",
                govt_body="State Electricity Board, DISCOM",
                university_expertise=["Electrical Engineering", "Renewable Energy"],
                startup_type="EnergyTech / CleanTech",
                ngo_type="Energy Access",
                solution_path="Audit → Design Solution → Deploy Pilot"
            ),
            StakeholderMapping(
                category="Waste Management / Environment",
                govt_body="Municipal Corporation, Pollution Control Board",
                university_expertise=["Environmental Science", "Chemical Engineering"],
                startup_type="WasteTech / CleanTech",
                ngo_type="Environment & Sustainability",
                solution_path="Waste Audit → System Design → Community Pilot"
            ),
            StakeholderMapping(
                category="Public Safety / Security",
                govt_body="Police Department, District Administration",
                university_expertise=["Criminology", "Social Work", "AI/ML"],
                startup_type="SafetyTech / SurvTech",
                ngo_type="Community Safety & Rights",
                solution_path="Risk Assessment → Technology Design → Deployment"
            ),
            StakeholderMapping(
                category="Digital Infrastructure / Connectivity",
                govt_body="IT Department, BSNL, BharatNet",
                university_expertise=["Computer Science", "Electronics", "IT"],
                startup_type="ConnectivityTech",
                ngo_type="Digital Literacy & Access",
                solution_path="Gap Analysis → Infrastructure Plan → Deployment"
            ),
            StakeholderMapping(
                category="Housing / Urban Development",
                govt_body="Housing Board, Urban Development Authority",
                university_expertise=["Architecture", "Civil Engineering", "Urban Planning"],
                startup_type="PropTech / ConstructionTech",
                ngo_type="Housing & Habitat",
                solution_path="Survey → Design → Pilot Construction"
            ),
            StakeholderMapping(
                category="Women / Child Welfare",
                govt_body="Women & Child Development Dept, ICDS",
                university_expertise=["Social Work", "Public Policy", "Psychology"],
                startup_type="SocialTech",
                ngo_type="Women Empowerment & Child Welfare",
                solution_path="Needs Assessment → Program Design → Pilot"
            ),
            StakeholderMapping(
                category="Employment / Livelihood",
                govt_body="Labour Department, Skill Development Mission",
                university_expertise=["Economics", "Business Administration", "Rural Management"],
                startup_type="JobTech / SkillTech",
                ngo_type="Livelihood & Entrepreneurship",
                solution_path="Market Study → Skill Mapping → Training Program"
            ),
        ]
        db.add_all(mappings)
        
        # === 2. ORGANIZATIONS ===
        organizations = [
            Organization(id=1, name="BIT Mesra", org_type="university",
                        expertise_tags=["Computer Science", "Civil Engineering", "Electronics"],
                        location="Ranchi, Jharkhand",
                        description="Birla Institute of Technology, premier engineering institute"),
            Organization(id=2, name="IIT(ISM) Dhanbad", org_type="university",
                        expertise_tags=["Mining Engineering", "Environmental Engineering", "AI/ML"],
                        location="Dhanbad, Jharkhand",
                        description="Indian Institute of Technology (Indian School of Mines)"),
            Organization(id=3, name="Ranchi University", org_type="university",
                        expertise_tags=["Social Sciences", "Agriculture", "Education"],
                        location="Ranchi, Jharkhand",
                        description="State university with diverse departments"),
            Organization(id=4, name="JharkhandTech Solutions", org_type="startup",
                        expertise_tags=["WaterTech", "IoT", "Smart City"],
                        location="Ranchi, Jharkhand",
                        description="Local startup focused on civic tech solutions"),
            Organization(id=5, name="Green Earth Foundation", org_type="ngo",
                        expertise_tags=["Environment", "Water Conservation", "Sustainability"],
                        location="Ranchi, Jharkhand",
                        description="NGO working on environmental sustainability"),
            Organization(id=6, name="District Administration Ranchi", org_type="govt",
                        expertise_tags=["Governance", "Public Administration"],
                        location="Ranchi, Jharkhand",
                        description="District administration office"),
            Organization(id=7, name="XLRI Jamshedpur", org_type="university",
                        expertise_tags=["Business Administration", "Rural Management", "HR"],
                        location="Jamshedpur, Jharkhand",
                        description="Premier management institute"),
            Organization(id=8, name="Rural Health Initiative", org_type="ngo",
                        expertise_tags=["Healthcare", "Community Health", "Nutrition"],
                        location="Hazaribagh, Jharkhand",
                        description="NGO focused on rural healthcare access"),
        ]
        db.add_all(organizations)
        db.flush()
        
        # === 3. USERS ===
        users = [
            User(id=1, name="Rahul Kumar", phone="9876543210", role="citizen"),
            User(id=2, name="Priya Sharma", phone="9876543211", role="citizen"),
            User(id=3, name="Amit Singh", phone="9876543212", role="citizen"),
            User(id=4, name="Sneha Gupta", phone="9876543213", role="citizen"),
            User(id=5, name="Vikram Patel", phone="9876543214", role="citizen"),
            User(id=6, name="Ananya Das", phone="9876543215", role="citizen"),
            User(id=7, name="Dr. Rajesh Verma", phone="9876543220", role="validator"),
            User(id=8, name="Collector Ranchi Office", phone="9876543221", role="validator"),
            User(id=9, name="Prof. Sunil Mehta", phone="9876543230", role="solver", organization_id=1),
            User(id=10, name="Dr. Kavita Roy", phone="9876543231", role="solver", organization_id=2),
            User(id=11, name="Arjun Startup", phone="9876543232", role="solver", organization_id=4),
            User(id=12, name="Admin User", phone="9876543200", role="admin"),
        ]
        db.add_all(users)
        db.flush()
        
        # === 4. SAMPLE PROBLEMS (20+ realistic problems) ===
        sample_problems = [
            {
                "title": "Waterlogging near university hostel",
                "description": "Every time it rains, water collects near our hostel road. Students cannot walk properly and the problem has been happening for months. The drainage system is completely blocked. During monsoon, water level rises up to knee height and creates risk of waterborne diseases.",
                "location": "BIT Mesra Campus, Ranchi",
                "severity": "high",
                "submitted_by": 1,
                "confirmations": 23
            },
            {
                "title": "No primary health centre within 10 km",
                "description": "Our village Harairbagh has no primary healthcare centre. The nearest hospital is 15 km away. Villagers have to travel far for basic treatment. Pregnant women face serious risks during emergencies. Around 500 families are affected.",
                "location": "Harairbagh, Jharkhand",
                "severity": "high",
                "submitted_by": 2,
                "confirmations": 45
            },
            {
                "title": "Broken road connecting two villages",
                "description": "The road connecting Karma village to Bero block has been damaged for over a year. Large potholes make it dangerous for vehicles. School children risk their safety walking on this road daily. Multiple accidents have occurred.",
                "location": "Karma-Bero Road, Ranchi District",
                "severity": "high",
                "submitted_by": 3,
                "confirmations": 31
            },
            {
                "title": "Crop damage due to lack of irrigation",
                "description": "Farmers in our area depend entirely on rainfall. This year's irregular monsoon has damaged most crops. We need a small irrigation canal or bore well facility. Around 200 farming families are suffering heavy losses.",
                "location": "Ormanjhi Block, Ranchi",
                "severity": "high",
                "submitted_by": 4,
                "confirmations": 18
            },
            {
                "title": "Frequent power outages in residential colony",
                "description": "Our area faces 6-8 hours of power cuts daily. The transformer is old and keeps failing. Electricity board has been informed multiple times but no action taken. Students cannot study at night.",
                "location": "Doranda Colony, Ranchi",
                "severity": "medium",
                "submitted_by": 5,
                "confirmations": 15
            },
            {
                "title": "Garbage not collected for weeks in ward 15",
                "description": "Municipal garbage collection has stopped in our ward for the past 3 weeks. Waste is piling up on streets and near houses. Stray dogs are spreading garbage everywhere. The smell is unbearable and attracting flies and mosquitoes.",
                "location": "Ward 15, Ranchi Municipal Corporation",
                "severity": "medium",
                "submitted_by": 6,
                "confirmations": 12
            },
            {
                "title": "School building in dangerous condition",
                "description": "The government primary school building has cracks in the walls and the roof leaks badly during rain. Children sit in unsafe conditions. Two classrooms have been declared unfit but classes still continue there due to space shortage.",
                "location": "Kanke Block, Ranchi",
                "severity": "high",
                "submitted_by": 1,
                "confirmations": 28
            },
            {
                "title": "No internet connectivity in tribal area",
                "description": "Our village has no mobile network or internet access. Students cannot access online education. Government e-services are inaccessible. The nearest mobile tower is 20 km away.",
                "location": "Khunti District, Jharkhand",
                "severity": "medium",
                "submitted_by": 2,
                "confirmations": 8
            },
            {
                "title": "Open drainage causing health hazard",
                "description": "The drainage system in our area is open and overflowing. Sewage water flows on the street. Children play near contaminated water. Multiple cases of skin disease and diarrhea have been reported in the last month.",
                "location": "Lalpur, Ranchi",
                "severity": "high",
                "submitted_by": 3,
                "confirmations": 19
            },
            {
                "title": "Street lights not working for 6 months",
                "description": "Most street lights in our locality have been non-functional for 6 months. The area becomes completely dark after sunset. Women feel unsafe walking at night. Two chain snatching incidents reported last month.",
                "location": "Bariatu Road, Ranchi",
                "severity": "medium",
                "submitted_by": 4,
                "confirmations": 10
            },
            {
                "title": "Lack of clean drinking water in village",
                "description": "The hand pump in our village has stopped working. The bore well water is contaminated with iron. Villagers are forced to walk 3 km to fetch clean water. Women and children spend hours daily on water collection.",
                "location": "Bundu Block, Ranchi District",
                "severity": "high",
                "submitted_by": 5,
                "confirmations": 35
            },
            {
                "title": "Anganwadi centre not functioning properly",
                "description": "The anganwadi centre in our village has been irregularly functioning. The worker comes only 2-3 days a week. Children are not getting proper nutrition supplements. Immunization records are not being maintained.",
                "location": "Torpa Block, Khunti",
                "severity": "medium",
                "submitted_by": 6,
                "confirmations": 7
            },
            {
                "title": "Youth unemployment in mining areas",
                "description": "After coal mine closures, hundreds of youth in our area are unemployed. No skill development centres nearby. Young people are migrating to other states for daily wage work. Need vocational training facility.",
                "location": "Dhanbad District, Jharkhand",
                "severity": "medium",
                "submitted_by": 1,
                "confirmations": 22
            },
            {
                "title": "Illegal sand mining destroying river bank",
                "description": "Illegal sand mining is happening on the Subarnarekha river near our village. The river bank is eroding rapidly. Agricultural land near the river is being destroyed. Despite complaints, no action has been taken.",
                "location": "Subarnarekha River, East Singhbhum",
                "severity": "high",
                "submitted_by": 2,
                "confirmations": 14
            },
            {
                "title": "No bus service to remote village",
                "description": "Our village has no public transport connectivity. The nearest bus stop is 8 km away. Students, elderly, and patients face extreme difficulty. Private auto-rickshaws charge very high fares.",
                "location": "Gumla District, Jharkhand",
                "severity": "medium",
                "submitted_by": 3,
                "confirmations": 11
            },
            {
                "title": "Deforestation threatening local wildlife",
                "description": "Large-scale tree cutting is happening near Palamau forest area. Elephants are increasingly entering villages due to habitat loss. Human-animal conflict is rising. Forest department is not taking adequate measures.",
                "location": "Palamau District, Jharkhand",
                "severity": "high",
                "submitted_by": 4,
                "confirmations": 9
            },
            {
                "title": "Government school lacks basic infrastructure",
                "description": "Our village government school has no proper toilets, no drinking water facility, and broken furniture. Girls especially face problems due to lack of separate toilets. Enrollment is dropping every year.",
                "location": "Lohardaga District, Jharkhand",
                "severity": "medium",
                "submitted_by": 5,
                "confirmations": 16
            },
            {
                "title": "Contaminated water from nearby factory",
                "description": "The chemical factory upstream is releasing untreated waste into the river. The water has turned dark and smells bad. Fish have died. Villagers using river water are reporting skin rashes and stomach problems. This is an urgent health emergency.",
                "location": "Adityapur Industrial Area, Jamshedpur",
                "severity": "high",
                "submitted_by": 6,
                "confirmations": 42
            },
            {
                "title": "Solar micro-grid needed for off-grid hamlet",
                "description": "Our hamlet of 50 families has never been connected to the electricity grid. Children study by kerosene lamps. We have heard about solar micro-grids and believe it could transform our village.",
                "location": "West Singhbhum, Jharkhand",
                "severity": "medium",
                "submitted_by": 1,
                "confirmations": 6
            },
            {
                "title": "Bridge collapsed months ago, no repair",
                "description": "The only bridge connecting our village to the main road collapsed during floods 4 months ago. There is no alternative route. Villagers are crossing the river by wading through water which is extremely dangerous especially for children and elderly.",
                "location": "Simdega District, Jharkhand",
                "severity": "high",
                "submitted_by": 2,
                "confirmations": 38
            },
        ]
        
        statuses = ["published", "published", "community_validated", "published",
                    "published", "published", "community_validated", "published",
                    "under_review", "published", "community_validated", "published",
                    "adopted", "published", "published", "published",
                    "published", "under_review", "published", "community_validated"]
        
        for i, prob_data in enumerate(sample_problems):
            # Run AI analysis
            ai_result = analyze_problem(prob_data["title"], prob_data["description"])
            
            # Calculate priority
            priority = calculate_priority(
                confirmation_count=prob_data["confirmations"],
                has_evidence=random.choice([True, False]),
                evidence_count=random.randint(0, 3),
                severity=prob_data["severity"],
                description=prob_data["description"]
            )
            
            problem = Problem(
                problem_id=f"P{i+1:03d}",
                title=prob_data["title"],
                description=prob_data["description"],
                location=prob_data["location"],
                severity=prob_data["severity"],
                submitted_by=prob_data["submitted_by"],
                status=statuses[i],
                ai_summary=ai_result["summary"],
                ai_category=ai_result["suggested_category"],
                ai_tags=ai_result["tags"],
                ai_domains=ai_result["possible_domains"],
                ai_duplicate_hint=ai_result["possible_duplicate_query"],
                priority_score=priority["total"],
                priority_breakdown=priority,
                confirmation_count=prob_data["confirmations"],
                created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30)),
                updated_at=datetime.now(timezone.utc) - timedelta(days=random.randint(0, 5))
            )
            db.add(problem)
        
        db.flush()
        
        # === 5. SAMPLE CONFIRMATIONS ===
        for prob_id in range(1, 6):
            for user_id in range(1, 7):
                if random.random() > 0.4:
                    conf = Confirmation(
                        problem_id=prob_id,
                        user_id=user_id,
                        note=random.choice([
                            "I face this issue too",
                            "This has been a problem for months",
                            "Please fix this urgently",
                            "Confirmed, I live nearby",
                            None
                        ])
                    )
                    db.add(conf)
        
        # === 6. SAMPLE ADOPTIONS ===
        adoption1 = SolverAdoption(
            problem_id=13,  # Youth unemployment
            organization_id=7,  # XLRI
            status="adopted",
            notes="We can design a skill development program for displaced mining workers"
        )
        adoption2 = SolverAdoption(
            problem_id=1,  # Waterlogging
            organization_id=1,  # BIT Mesra
            status="interested",
            notes="Our Civil Engineering dept can assess drainage and propose solutions"
        )
        db.add_all([adoption1, adoption2])
        
        db.commit()
        print(f"Seeded: {len(users)} users, {len(organizations)} orgs, {len(sample_problems)} problems, {len(mappings)} stakeholder mappings")
        
    except Exception as e:
        db.rollback()
        print(f"Seeding error: {e}")
        raise
    finally:
        db.close()
