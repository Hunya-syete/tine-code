<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ResumeController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => [
                'name' => 'Christine June M. Jumawan',
                'title' => 'Software Engineer | Web Developer',
                'summary' => 'Software Engineer with 4+ years of experience in web development, specializing in WordPress, CMS platforms, scalable applications, and backend systems. Experienced as a college instructor and as a web developer using Laravel, Next.js, Python/Django, and modern SEO practices.',
                'location' => 'Dipolog City, Zamboanga del Norte 7100, Philippines',
                'contacts' => [
                    'email' => 'tinangmariclilones@gmail.com',
                    'phone' => '09451772126',
                    'linkedin' => 'https://www.linkedin.com/in/cmarcilones',
                    'linkedin_label' => 'cmarcilones',
                ],
                'skills' => [
                    'Installing, configuring, maintaining, and troubleshooting computer hardware, software, systems, networks, printers, and scanners',
                    '2D Animation',
                    'WordPress and CMS development',
                    'SEO (technical and content optimization)',
                    'Web development with Laravel and Next.js',
                    'Project tools: Jira, Infinity, Trello, Canva',
                    'Administrative support: scheduling, email handling, newsletters, market research, and customer service',
                ],
                'education' => [
                    [
                        'school' => 'Mindanao State University - Iligan Institute of Technology',
                        'degree' => 'Master of Science in Electrical Engineering',
                        'date_range' => 'August 2025 - Present',
                    ],
                    [
                        'school' => 'Saint Vincent\'s College Incorporated',
                        'degree' => 'Bachelor\'s Degree in Computer Engineering (Graduated as Cum Laude)',
                        'date_range' => '2015 - 2020',
                    ],
                    [
                        'school' => 'Zamboanga del Norte National High School',
                        'degree' => 'Secondary Education',
                        'date_range' => '2011 - 2015',
                    ],
                    [
                        'school' => 'Dipolog Pilot Demonstration School',
                        'degree' => 'Primary Education (Graduated with Honor)',
                        'date_range' => '2006 - 2011',
                    ],
                ],
                'certificates' => [
                    '2D Animation NCIII Training for Work Scholarship Program (TESDA)',
                    'National Certificates Computer Systems Servicing NCII',
                    '2D Animation NCIII',
                    'SAP Business One',
                    'SAP Advance',
                    'Booking Course Featuring Xerox & QuickBooks',
                    'Python Programming Essentials Course (DICT)',
                    'ERP SmartBooks Trainer',
                ],
                'experience' => [
                    [
                        'company' => 'St. Vincent\'s College Incorporated',
                        'role' => 'Instructor',
                        'date_range' => 'August 2023 - Present',
                        'highlights' => [
                            'Teach computing-related subjects and mentor students in practical software development workflows.',
                        ],
                    ],
                    [
                        'company' => 'Church Finance Pros',
                        'role' => 'Web Developer',
                        'date_range' => 'November 2022 - October 2023',
                        'highlights' => [
                            'Created custom WordPress themes and customized existing themes based on client requirements.',
                            'Developed WordPress plugins to extend core functionality and support project-specific needs.',
                            'Configured CMS environments and enabled easy content updates for non-technical users.',
                            'Improved web performance using caching, image optimization, and request minimization.',
                            'Set up WooCommerce and MemberPress for e-commerce and product management.',
                            'Executed SEO strategies including metadata, XML sitemaps, keyword research, audits, and reporting.',
                        ],
                    ],
                    [
                        'company' => 'Viventiis Interim',
                        'role' => 'Web Developer',
                        'date_range' => 'December 2021 - May 2022',
                        'highlights' => [
                            'Developed and maintained backend logic using Python frameworks such as Django.',
                            'Built and managed databases with ORMs including Django ORM and SQLAlchemy.',
                            'Implemented APIs for secure data exchange between frontend and backend systems.',
                            'Applied backend security best practices such as validation, sanitization, and secure coding.',
                            'Performed testing and debugging to ensure application reliability and stability.',
                        ],
                    ],
                    [
                        'company' => 'ChroanoPS',
                        'role' => 'WordPress Developer',
                        'date_range' => 'November 2021 - March 2022',
                        'highlights' => [
                            'Built and maintained websites using HTML, CSS, JavaScript, and PHP.',
                            'Collaborated with teams on design specifications and implementation.',
                            'Troubleshot and updated existing websites while monitoring traffic trends.',
                        ],
                    ],
                    [
                        'company' => 'Simplecloudology',
                        'role' => 'Web Developer',
                        'date_range' => 'November 2020 - December 2021',
                        'highlights' => [
                            'Developed and maintained server-side logic for Laravel PHP applications.',
                            'Handled database modeling, migrations, and querying using Eloquent ORM.',
                            'Diagnosed and resolved backend-related issues to improve system stability and UX.',
                        ],
                    ],
                ],
            ],
        ]);
    }
}
