const fs = require('fs');
const path = require('path');

const companyList = [
  // 1. Big Tech & Frontier AI (15)
  ['Google', 'GOOGL', 'Tier 1 Big Tech', 1.48, 15, 25, 18, 1.5, 4.5, 'Mountain View, CA, USA', 'GOOG', ['AI & Cloud', 'Search', 'Consumer Tech'], ['Comprehensive Health', '401k/PF Match', 'GSU Equity', 'Wellness']],
  ['Microsoft', 'MSFT', 'Tier 1 Big Tech', 1.42, 10, 25, 16, 1.35, 4.4, 'Redmond, WA, USA', 'MSFT', ['Enterprise Cloud', 'AI', 'Software'], ['Merit Stock', 'Parental Leave', 'Hybrid Flexibility', 'Tuition Assistance']],
  ['Meta', 'META', 'Tier 1 Big Tech', 1.52, 15, 30, 20, 1.6, 4.3, 'Menlo Park, CA, USA', 'META', ['Social Media', 'VR/AR', 'AI Infrastructure'], ['Top RSUs', 'Wellness Stipend', 'Gourmet Meals', 'Family Planning']],
  ['Amazon', 'AMZN', 'Tier 1 Big Tech', 1.40, 5, 15, 10, 1.45, 4.0, 'Seattle, WA, USA', 'AMZN', ['Cloud (AWS)', 'E-Commerce', 'Logistics'], ['Sign-on Bonus', 'RSU Vesting', 'AWS Discounts', 'Comprehensive Care']],
  ['Apple', 'AAPL', 'Tier 1 Big Tech', 1.44, 10, 20, 15, 1.38, 4.4, 'Cupertino, CA, USA', 'AAPL', ['Hardware & Devices', 'Software', 'Silicon'], ['Product Discounts', 'Tuition Reimbursement', 'Annual RSUs', 'Wellness']],
  ['Netflix', 'NFLX', 'Tier 1 Big Tech', 1.55, 0, 5, 2, 1.1, 4.2, 'Los Gatos, CA, USA', 'NFLX', ['Streaming Tech', 'Distributed Media'], ['All-Cash Option', 'Unlimited PTO', 'Parental Support', 'No Cliff']],
  ['NVIDIA', 'NVDA', 'Tier 1 Big Tech', 1.54, 10, 20, 15, 1.65, 4.7, 'Santa Clara, CA, USA', 'NVDA', ['AI Compute & GPUs', 'Semiconductors'], ['ESPP Program', 'High RSU Grants', '401k Match', 'Flexible Work']],
  ['OpenAI', '', 'Tier 1 Big Tech', 1.68, 10, 25, 18, 1.8, 4.6, 'San Francisco, CA, USA', 'OPENAI', ['Frontier AI Models', 'Generative AI'], ['PPU Equity Structure', 'Premium Health', 'AI Compute Access', 'Relocation']],
  ['Anthropic', '', 'Tier 1 Big Tech', 1.65, 10, 25, 18, 1.75, 4.6, 'San Francisco, CA, USA', 'ANTH', ['AI Safety', 'Claude LLMs', 'AI Research'], ['Top Equity', 'Comprehensive Health', 'Compute Access', 'Stipends']],
  ['Tesla', 'TSLA', 'Tier 1 Big Tech', 1.35, 0, 10, 5, 1.45, 3.8, 'Austin, TX, USA', 'TSLA', ['EVs', 'Autopilot Vision', 'Clean Energy'], ['Equity Upside', 'Vehicle Discounts', 'Medical Care', 'Advancement']],
  ['ByteDance', '', 'Tier 1 Big Tech', 1.46, 10, 25, 18, 1.42, 4.1, 'Beijing & Singapore', 'BYTE', ['TikTok', 'Short Video', 'Recommendation AI'], ['Competitive RSUs', 'Meal Allowance', 'Health Coverage', 'Bonuses']],
  ['Twitter (X)', '', 'Tier 1 Big Tech', 1.38, 5, 15, 10, 1.25, 3.7, 'Austin, TX, USA', 'X', ['Social Network', 'Grok AI', 'Real-Time Data'], ['Performance Equity', 'Health Care', 'Rapid Innovation']],
  ['DeepMind', '', 'Tier 1 Big Tech', 1.55, 12, 25, 18, 1.55, 4.6, 'London, UK', 'DEEP', ['Artificial General Intelligence', 'Science AI'], ['Google Comp Structure', 'Compute', 'Research Freedom']],
  ['Palantir Technologies', 'PLTR', 'Tier 1 Big Tech', 1.38, 8, 20, 14, 1.4, 4.2, 'Denver, CO, USA', 'PLTR', ['Enterprise AI (AIP)', 'Defense Tech', 'Big Data'], ['Stock Refreshers', 'Health Benefits', 'High Autonomy']],
  ['Snowflake', 'SNOW', 'Tier 1 Big Tech', 1.42, 10, 20, 15, 1.45, 4.3, 'Bozeman, MT, USA', 'SNOW', ['Data Cloud', 'Data Warehousing', 'AI Apps'], ['Competitive RSUs', 'Home Office Fund', 'Health Plan']],

  // 2. Enterprise SaaS, Cloud & Dev Tools (35)
  ['Oracle', 'ORCL', 'Enterprise Cloud', 1.25, 10, 20, 12, 1.15, 4.1, 'Austin, TX, USA', 'ORCL', ['OCI Cloud', 'Databases', 'ERP'], ['OCI Credits', 'Flexible Work', 'Health Coverage', 'ESPP']],
  ['Adobe', 'ADBE', 'Enterprise Cloud', 1.36, 12, 22, 16, 1.32, 4.5, 'San Jose, CA, USA', 'ADBE', ['Creative Cloud', 'Digital Experience'], ['Company Shutdowns', 'Sabbatical', 'Creative Cloud Sub', 'Education Fund']],
  ['Salesforce', 'CRM', 'Enterprise Cloud', 1.35, 10, 20, 15, 1.28, 4.3, 'San Francisco, CA, USA', 'CRM', ['CRM Cloud', 'Marketing Cloud', 'Data Cloud'], ['7 Days VTO', 'Wellbeing Reimbursement', 'Parental Perks']],
  ['ServiceNow', 'NOW', 'Enterprise Cloud', 1.34, 10, 20, 15, 1.30, 4.4, 'Santa Clara, CA, USA', 'NOW', ['Enterprise Workflows', 'ITSM', 'AI Platform'], ['Competitive RSUs', 'Global Mobility', 'Health Insurance']],
  ['Databricks', '', 'Enterprise Cloud', 1.48, 10, 25, 15, 1.60, 4.5, 'San Francisco, CA, USA', 'DATA', ['Lakehouse Platform', 'Apache Spark', 'MLflow'], ['Pre-IPO Equity', 'Remote Stipend', 'Health Insurance']],
  ['Atlassian', 'TEAM', 'Enterprise Cloud', 1.34, 10, 20, 14, 1.30, 4.4, 'Sydney, Australia', 'TEAM', ['Jira', 'Confluence', 'Agile Tools'], ['Team Anywhere Policy', 'Home Office Stipend', 'Health Cover']],
  ['Workday', 'WDAY', 'Enterprise Cloud', 1.28, 10, 20, 14, 1.20, 4.3, 'Pleasanton, CA, USA', 'WDAY', ['Enterprise HCM', 'Finance Cloud'], ['401k Match', 'Tuition Assistance', 'Wellness Program']],
  ['Intuit', 'INTU', 'Enterprise Cloud', 1.32, 10, 20, 15, 1.25, 4.4, 'Mountain View, CA, USA', 'INTU', ['TurboTax', 'QuickBooks', 'Credit Karma'], ['Annual Bonus Plan', 'ESPP Discount', 'Comprehensive Health']],
  ['SAP', 'SAP', 'Enterprise Cloud', 1.20, 8, 18, 12, 1.10, 4.2, 'Walldorf, Germany', 'SAP', ['Enterprise ERP', 'S/4HANA', 'Supply Chain'], ['German Pension Perks', 'Profit Sharing', 'Hybrid Work']],
  ['VMware', '', 'Enterprise Cloud', 1.26, 10, 20, 14, 1.18, 4.1, 'Palo Alto, CA, USA', 'VMW', ['Cloud Virtualization', 'Kubernetes Tanzu'], ['Broadcom Benefits', 'Education Subsidy', 'Health Plans']],
  ['Zoom Video', 'ZM', 'Enterprise Cloud', 1.28, 10, 20, 14, 1.22, 4.2, 'San Jose, CA, USA', 'ZM', ['Video Collaboration', 'Zoom AI Companion'], ['Home Office Stipend', 'Gym Reimbursement', 'RSUs']],
  ['Splunk', '', 'Enterprise Cloud', 1.32, 10, 20, 15, 1.25, 4.2, 'San Francisco, CA, USA', 'SPLK', ['Security Analytics', 'SIEM', 'Observability'], ['Cisco Comp Package', 'Parental Leave', '401k Match']],
  ['Twilio', 'TWLO', 'Enterprise Cloud', 1.30, 10, 20, 14, 1.24, 4.1, 'San Francisco, CA, USA', 'TWLO', ['Communications APIs', 'Segment CDP'], ['Remote Flexibility', 'Stock Units', 'Wellness Fund']],
  ['MongoDB', 'MDB', 'Enterprise Cloud', 1.35, 10, 20, 15, 1.32, 4.3, 'New York, NY, USA', 'MDB', ['NoSQL Database', 'MongoDB Atlas'], ['High Equity Grants', 'Flexible Vacation', 'Medical Cover']],
  ['Elastic', 'ESTC', 'Enterprise Cloud', 1.28, 10, 20, 14, 1.22, 4.2, 'Mountain View, CA, USA', 'ESTC', ['Elasticsearch', 'Kibana', 'Vector Search'], ['Source-Code Distributed Culture', 'Stipends', 'Health']],
  ['HubSpot', 'HUBS', 'Enterprise Cloud', 1.32, 10, 20, 14, 1.28, 4.5, 'Cambridge, MA, USA', 'HUBS', ['Inbound Marketing', 'Sales CRM'], ['Unlimited Vacation', 'Tuition Reimbursement', 'Parental Leave']],
  ['Box', 'BOX', 'Enterprise Cloud', 1.24, 8, 18, 12, 1.15, 4.1, 'Redwood City, CA, USA', 'BOX', ['Cloud Content Management', 'Enterprise Storage'], ['Health & Dental', 'Stock Purchase Plan', 'Stipends']],
  ['Dropbox', 'DBX', 'Enterprise Cloud', 1.34, 10, 20, 14, 1.30, 4.3, 'San Francisco, CA, USA', 'DBX', ['Cloud Collaboration', 'Virtual First'], ['Virtual First Per Diem ($7k/yr)', 'Wellness Perks', 'Equity']],
  ['DocuSign', 'DOCU', 'Enterprise Cloud', 1.26, 10, 20, 13, 1.18, 4.0, 'San Francisco, CA, USA', 'DOCU', ['E-Signature', 'Contract Lifecycle Management'], ['401k Match', 'Health Insurance', 'Employee Discounts']],
  ['Asana', 'ASAN', 'Enterprise Cloud', 1.30, 10, 20, 14, 1.25, 4.4, 'San Francisco, CA, USA', 'ASAN', ['Work Management', 'Enterprise Collaboration'], ['Free Meals', 'Mentorship Programs', 'Wellness Stipends']],
  ['Cloudflare', 'NET', 'Enterprise Cloud', 1.36, 10, 20, 14, 1.32, 4.3, 'San Francisco, CA, USA', 'NET', ['Edge Computing', 'CDN', 'DDoS Protection'], ['Generous Stock Grants', 'Health Benefits', 'Remote Friendly']],
  ['Fastly', 'FSLY', 'Enterprise Cloud', 1.25, 8, 18, 12, 1.18, 4.0, 'San Francisco, CA, USA', 'FSLY', ['Edge Cloud', 'Compute@Edge', 'Security'], ['Flexible Time Off', 'Health Insurance', 'ESPP']],
  ['Okta', 'OKTA', 'Enterprise Cloud', 1.30, 10, 20, 14, 1.24, 4.1, 'San Francisco, CA, USA', 'OKTA', ['Identity & Access Management', 'Auth0'], ['Dynamic Work Policy', 'Wellness Reimbursement', 'RSUs']],
  ['Zscaler', 'ZS', 'Enterprise Cloud', 1.34, 10, 20, 15, 1.30, 4.2, 'San Jose, CA, USA', 'ZS', ['Zero Trust Architecture', 'Cloud Security'], ['Competitive Stock Grants', 'Health Care', 'Sales Incentive']],
  ['CrowdStrike', 'CRWD', 'Enterprise Cloud', 1.38, 10, 22, 15, 1.35, 4.3, 'Austin, TX, USA', 'CRWD', ['Endpoint Security', 'Falcon Platform'], ['Remote First Culture', 'Stock Refreshers', 'Health Savings']],
  ['Dynatrace', 'DT', 'Enterprise Cloud', 1.26, 8, 18, 12, 1.18, 4.2, 'Waltham, MA, USA', 'DT', ['AI Observability', 'Application Performance'], ['Employee Stock Option', 'Hybrid Perks', 'Certifications']],
  ['Datadog', 'DDOG', 'Enterprise Cloud', 1.40, 10, 22, 15, 1.38, 4.4, 'New York, NY, USA', 'DDOG', ['Cloud Monitoring', 'Log Management', 'APM'], ['Top Market RSUs', 'Annual Merit Cycles', 'Health Benefits']],
  ['Confluent', 'CFLT', 'Enterprise Cloud', 1.35, 10, 20, 14, 1.30, 4.3, 'Mountain View, CA, USA', 'CFLT', ['Data Streaming', 'Apache Kafka'], ['Generous Equity Grants', 'Remote Choice', 'Wellness']],
  ['HashiCorp', '', 'Enterprise Cloud', 1.32, 10, 20, 14, 1.26, 4.2, 'San Francisco, CA, USA', 'HASHI', ['Terraform', 'Vault', 'Consul'], ['IBM Benefits Integration', 'Remote First', 'Equipment Fund']],
  ['GitLab', 'GTLB', 'Enterprise Cloud', 1.32, 10, 20, 14, 1.25, 4.4, 'All-Remote Company', 'GTLB', ['DevSecOps Platform', 'CI/CD'], ['100% All-Remote Stipend', 'Growth & Development Budget', 'Equity']],
  ['GitHub', '', 'Enterprise Cloud', 1.40, 10, 22, 16, 1.35, 4.6, 'San Francisco, CA, USA', 'GH', ['Code Collaboration', 'GitHub Copilot'], ['Microsoft Benefits', 'Remote Flexibility', 'Top Tier Care']],
  ['PagerDuty', 'PD', 'Enterprise Cloud', 1.26, 8, 18, 12, 1.18, 4.1, 'San Francisco, CA, USA', 'PD', ['Incident Response', 'Digital Operations'], ['Health Coverage', 'Employee Stock Purchase', 'Stipends']],
  ['New Relic', '', 'Enterprise Cloud', 1.24, 8, 18, 12, 1.15, 4.0, 'San Francisco, CA, USA', 'NEWR', ['Full-Stack Observability', 'Telemetry'], ['Flexible Time Off', 'Health Plan', 'Equipment Allowance']],
  ['Zendesk', '', 'Enterprise Cloud', 1.25, 8, 18, 12, 1.16, 4.1, 'San Francisco, CA, USA', 'ZEN', ['Customer Service Software', 'Helpdesk'], ['Digital First Work', 'Health Benefits', 'Volunteer Hours']],
  ['Smartsheet', '', 'Enterprise Cloud', 1.22, 8, 18, 12, 1.14, 4.2, 'Bellevue, WA, USA', 'SMAR', ['Workplace Automation', 'Dynamic Collaboration'], ['Parental Leave', '401k Match', 'Flexible Schedules']],

  // 3. Semiconductor, Hardware & Computing (25)
  ['Intel', 'INTC', 'Hardware & Semiconductor', 1.24, 8, 18, 12, 1.15, 4.0, 'Santa Clara, CA, USA', 'INTC', ['Processors', 'Foundry Services'], ['Annual Bonus', 'Sabbaticals', 'Tuition Aid', 'ESPP']],
  ['AMD', 'AMD', 'Hardware & Semiconductor', 1.32, 10, 20, 14, 1.30, 4.3, 'Santa Clara, CA, USA', 'AMD', ['Ryzen / EPYC CPUs', 'Data Center GPUs'], ['Competitive Equity', '401k Match', 'Health Subsidies']],
  ['Qualcomm', 'QCOM', 'Hardware & Semiconductor', 1.30, 10, 20, 14, 1.25, 4.2, 'San Diego, CA, USA', 'QCOM', ['Snapdragon SoCs', '5G Wireless'], ['Patent Bonuses', 'Fitness Centers', '401k & ESPP']],
  ['Broadcom', 'AVGO', 'Hardware & Semiconductor', 1.38, 12, 25, 18, 1.35, 4.1, 'Palo Alto, CA, USA', 'AVGO', ['Custom Silicon', 'Enterprise Networking'], ['High Equity Refreshers', 'Health Benefits', 'Retirement']],
  ['TSMC', 'TSM', 'Hardware & Semiconductor', 1.25, 15, 35, 22, 1.10, 4.0, 'Hsinchu, Taiwan', 'TSMC', ['Advanced Semiconductor Foundry', '3nm / 2nm'], ['High Profit Sharing Bonus', 'Medical Care', 'Relocation']],
  ['ASML', 'ASML', 'Hardware & Semiconductor', 1.30, 10, 25, 16, 1.20, 4.4, 'Veldhoven, Netherlands', 'ASML', ['EUV Lithography Systems', 'Semiconductor Equipment'], ['Dutch Pension Benefits', 'Profit Sharing', 'Global Mobility']],
  ['Micron Technology', 'MU', 'Hardware & Semiconductor', 1.22, 8, 18, 12, 1.14, 4.1, 'Boise, ID, USA', 'MU', ['DRAM Memory', 'NAND Flash Storage'], ['Annual Incentive Plan', 'Tuition Assistance', 'ESPP']],
  ['Texas Instruments', 'TXN', 'Hardware & Semiconductor', 1.20, 8, 18, 12, 1.10, 4.2, 'Dallas, TX, USA', 'TXN', ['Analog Chips', 'Embedded Processing'], ['Profit Sharing Plan', 'Health Benefits', 'Retirement 401k']],
  ['Applied Materials', 'AMAT', 'Hardware & Semiconductor', 1.26, 10, 20, 14, 1.18, 4.2, 'Santa Clara, CA, USA', 'AMAT', ['Materials Engineering', 'Chip Manufacturing Tools'], ['Annual Bonus', 'Stock Purchase Plan', 'Health Savings']],
  ['Lam Research', 'LRCX', 'Hardware & Semiconductor', 1.28, 10, 20, 14, 1.20, 4.3, 'Fremont, CA, USA', 'LRCX', ['Wafer Fabrication Equipment', 'Plasma Etch'], ['Performance Bonus', 'ESPP', 'Comprehensive Medical']],
  ['Arm', 'ARM', 'Hardware & Semiconductor', 1.34, 10, 20, 14, 1.28, 4.3, 'Cambridge, UK', 'ARM', ['Processor IP Architecture', 'RISC Computing'], ['UK / Global Pension', 'Merit Stock', 'Sabbatical Program']],
  ['Western Digital', 'WDC', 'Hardware & Semiconductor', 1.18, 8, 16, 11, 1.08, 3.9, 'San Jose, CA, USA', 'WDC', ['Hard Disk Drives', 'SSD Storage'], ['Annual Incentive Plan', 'Health Insurance', '401k']],
  ['Seagate Technology', 'STX', 'Hardware & Semiconductor', 1.16, 8, 16, 11, 1.06, 3.9, 'Fremont, CA, USA', 'STX', ['Mass Data Storage', 'Enterprise Exos'], ['Health Care', 'Employee Stock Purchase', 'Paid Leave']],
  ['Marvell Technology', 'MRVL', 'Hardware & Semiconductor', 1.30, 10, 20, 14, 1.25, 4.2, 'Wilmington, DE, USA', 'MRVL', ['Data Infrastructure Silicon', 'Optical PAM4'], ['Competitive RSUs', 'Health Plan', 'Bonus Program']],
  ['Synopsys', 'SNPS', 'Hardware & Semiconductor', 1.32, 10, 20, 14, 1.26, 4.3, 'Sunnyvale, CA, USA', 'SNPS', ['Electronic Design Automation (EDA)', 'Silicon IP'], ['Sabbatical Leave', 'Tuition Assistance', 'Stock Awards']],
  ['Cadence Design Systems', 'CDNS', 'Hardware & Semiconductor', 1.32, 10, 20, 14, 1.26, 4.4, 'San Jose, CA, USA', 'CDNS', ['EDA Software', 'Hardware Emulation'], ['Top Workplace Awards', 'Bonus Plan', 'Wellness Perks']],
  ['Analog Devices', 'ADI', 'Hardware & Semiconductor', 1.24, 8, 18, 12, 1.15, 4.2, 'Wilmington, MA, USA', 'ADI', ['Analog / Mixed-Signal Silicon', 'Sensors'], ['Annual Profit Sharing', '401k Matching', 'Medical']],
  ['NXP Semiconductors', 'NXPI', 'Hardware & Semiconductor', 1.22, 8, 18, 12, 1.12, 4.1, 'Eindhoven, Netherlands', 'NXPI', ['Automotive Microcontrollers', 'Secure IoT'], ['Performance Bonus', 'Health Coverage', 'Global Exposure']],
  ['Infineon Technologies', 'IFX', 'Hardware & Semiconductor', 1.20, 8, 18, 12, 1.10, 4.2, 'Neubiberg, Germany', 'IFX', ['Power Semiconductors', 'Automotive Chips'], ['German Benefits Package', 'Profit Share', 'Pension']],
  ['STMicroelectronics', 'STM', 'Hardware & Semiconductor', 1.18, 8, 16, 11, 1.08, 4.0, 'Geneva, Switzerland', 'STM', ['Microcontrollers (STM32)', 'Sensors'], ['European Health Cover', 'Annual Bonus', 'Training']],
  ['KLA Corporation', 'KLAC', 'Hardware & Semiconductor', 1.28, 10, 20, 14, 1.20, 4.3, 'Milpitas, CA, USA', 'KLAC', ['Process Control', 'Yield Management'], ['Cash Incentive Plan', 'ESPP Discount', 'Healthcare']],
  ['MediaTek', '', 'Hardware & Semiconductor', 1.22, 12, 28, 18, 1.12, 4.0, 'Hsinchu, Taiwan', 'MTK', ['Dimensity Mobile SoCs', 'Smart Home Chips'], ['Bi-Annual Bonuses', 'Health Coverage', 'Meal Subsidies']],
  ['Sony Group', 'SONY', 'Hardware & Semiconductor', 1.24, 10, 22, 15, 1.15, 4.2, 'Tokyo, Japan', 'SONY', ['PlayStation', 'Image Sensors', 'Entertainment'], ['Japanese Corporate Pension', 'Bonus Plan', 'Products']],
  ['Samsung Electronics', '', 'Hardware & Semiconductor', 1.22, 10, 30, 18, 1.12, 4.0, 'Suwon, South Korea', 'SEC', ['Memory Chips', 'Galaxy Smartphones', 'Displays'], ['Target Achievement Incentive', 'Global Rotation', 'Family Support']],
  ['LG Electronics', '', 'Hardware & Semiconductor', 1.16, 8, 20, 12, 1.05, 3.9, 'Seoul, South Korea', 'LGE', ['Vehicle Component Tech', 'Smart Appliances'], ['Performance Incentive', 'Healthcare', 'Tuition Aid']],

  // 4. Consumer Tech, Hardware & Devices (15)
  ['Dell Technologies', 'DELL', 'Enterprise Cloud', 1.20, 8, 18, 12, 1.12, 4.1, 'Round Rock, TX, USA', 'DELL', ['Enterprise Servers', 'PCs', 'Edge Infrastructure'], ['Annual Bonus', 'Connected Workplace (Remote)', '401k']],
  ['HP Inc', 'HPQ', 'Enterprise Cloud', 1.16, 7, 16, 11, 1.08, 4.0, 'Palo Alto, CA, USA', 'HP', ['Personal Systems', 'Printers', '3D Printing'], ['Health Care', 'Retirement Plan', 'Tuition Reimbursement']],
  ['Lenovo', '', 'Enterprise Cloud', 1.18, 8, 18, 12, 1.10, 4.0, 'Beijing, China & Morrisville, NC', 'LEN', ['ThinkPad Laptops', 'Data Center Infrastructure'], ['Incentive Bonus', 'Health Coverage', 'Global Work']],
  ['Cisco Systems', 'CSCO', 'Enterprise Cloud', 1.22, 8, 18, 12, 1.12, 4.3, 'San Jose, CA, USA', 'CSCO', ['Networking', 'Cybersecurity', 'Webex'], ['Work-Life Balance', 'Hybrid Choice', 'Volunteer Days']],
  ['Juniper Networks', '', 'Enterprise Cloud', 1.24, 8, 18, 12, 1.15, 4.1, 'Sunnyvale, CA, USA', 'JNPR', ['Mist AI Networking', 'Routers', 'Switches'], ['HPE Integration Benefits', 'Health Plans', '401k Match']],
  ['Arista Networks', 'ANET', 'Enterprise Cloud', 1.34, 10, 20, 14, 1.30, 4.4, 'Santa Clara, CA, USA', 'ANET', ['Cloud Networking', 'EOS Software', 'Ethernet'], ['Top Tier Stock Grants', 'Comprehensive Medical', 'ESPP']],
  ['Supermicro', 'SMCI', 'Hardware & Semiconductor', 1.22, 8, 18, 12, 1.15, 3.9, 'San Jose, CA, USA', 'SMCI', ['AI Server Building Blocks', 'Liquid Cooling'], ['Annual Bonus', 'ESPP', 'Health and Dental Insurance']],
  ['Foxconn', '', 'Hardware & Semiconductor', 1.10, 5, 15, 10, 1.00, 3.7, 'New Taipei City, Taiwan', 'FOX', ['Electronics Manufacturing Services (EMS)', 'Contract Tech'], ['Performance Bonus', 'Dormitory/Meal Subsidies', 'Health']],
  ['Asus', '', 'Hardware & Semiconductor', 1.14, 8, 18, 12, 1.05, 3.9, 'Taipei, Taiwan', 'ASUS', ['ROG Gaming Laptops', 'Motherboards'], ['Annual Bonus', 'Product Discounts', 'Health Insurance']],
  ['Acer', '', 'Hardware & Semiconductor', 1.12, 7, 16, 11, 1.04, 3.8, 'New Taipei City, Taiwan', 'ACER', ['Predator Gaming', 'PCs', 'Display Systems'], ['Health Cover', 'Performance Share', 'Parental Support']],
  ['Xiaomi', '', 'Hardware & Semiconductor', 1.20, 10, 25, 16, 1.12, 4.0, 'Beijing, China', 'XIAO', ['Smartphones', 'EV SU7', 'AIoT Smart Ecosystem'], ['Quarterly Bonus', 'Stock Options', 'Meal Stipends']],
  ['Huawei', '', 'Hardware & Semiconductor', 1.26, 15, 35, 22, 1.15, 4.0, 'Shenzhen, China', 'HW', ['5G Telecommunications', 'HarmonyOS', 'Cloud'], ['High Employee Shareholder Dividends', 'Competitive Comp']],
  ['Nintendo', '', 'Hardware & Semiconductor', 1.22, 10, 22, 15, 1.10, 4.5, 'Kyoto, Japan', 'NTDO', ['Nintendo Switch', 'Game Development'], ['Exceptional Stability', 'Bonus Plan', 'Family Benefits']],
  ['Logitech', 'LOGI', 'Enterprise Cloud', 1.20, 8, 18, 12, 1.12, 4.2, 'Lausanne, Switzerland', 'LOGI', ['PC Peripherals', 'Streaming Gear', 'Video Bars'], ['Swiss Pension Perks', 'Product Discounts', 'Hybrid Work']],
  ['Bose Corporation', '', 'Hardware & Semiconductor', 1.20, 8, 18, 12, 1.12, 4.1, 'Framingham, MA, USA', 'BOSE', ['Acoustic Audio Systems', 'Noise Canceling'], ['401k Match', 'Product Discounts', 'Tuition Aid']],

  // 5. FinTech, Payments & Crypto (25)
  ['Stripe', '', 'High-Growth Tech Unicorn', 1.48, 10, 20, 15, 1.50, 4.4, 'San Francisco, CA & Dublin', 'STRP', ['Payment Infrastructure', 'Billing SaaS'], ['Remote First Stipend ($2k/yr)', 'Comprehensive Care', 'Equity']],
  ['PayPal', 'PYPL', 'FinTech & Banking', 1.28, 10, 20, 14, 1.20, 4.0, 'San Jose, CA, USA', 'PYPL', ['Digital Wallets', 'Venmo', 'Braintree'], ['Annual Bonus', 'ESPP', 'Tuition Assistance', 'Wellness']],
  ['Block (Square)', 'SQ', 'High-Growth Tech Unicorn', 1.38, 10, 20, 14, 1.35, 4.2, 'Oakland, CA, USA', 'SQ', ['Cash App', 'Square POS', 'Tidal'], ['Remote Flexibility', 'Stock Grants', 'Wellness Stipend']],
  ['Adyen', 'ADYEN', 'FinTech & Banking', 1.36, 10, 20, 15, 1.30, 4.3, 'Amsterdam, Netherlands', 'ADYEN', ['Global Omnichannel Payments', 'Merchant Tech'], ['Dutch Healthcare/Pension', 'Performance Shares', 'Food']],
  ['Plaid', '', 'High-Growth Tech Unicorn', 1.42, 10, 20, 14, 1.40, 4.3, 'San Francisco, CA, USA', 'PLAID', ['Financial APIs', 'Open Banking Data'], ['Generous Equity', 'Health Coverage', 'Home Office Setup']],
  ['Robinhood', 'HOOD', 'High-Growth Tech Unicorn', 1.38, 10, 20, 14, 1.35, 4.1, 'Menlo Park, CA, USA', 'HOOD', ['Commission-free Brokerage', 'Crypto'], ['Remote First Policy', 'RSU Grants', 'Wellness Subsidy']],
  ['Coinbase', 'COIN', 'High-Growth Tech Unicorn', 1.44, 10, 20, 15, 1.40, 4.1, 'Remote First, USA', 'COIN', ['Crypto Exchange', 'Base Layer 2', 'Custody'], ['Remote-first Culture', 'Four Shutdown Weeks/yr', 'Crypto Grants']],
  ['Kraken', '', 'High-Growth Tech Unicorn', 1.32, 10, 20, 14, 1.25, 4.0, 'San Francisco, CA, USA', 'KRAK', ['Cryptocurrency Exchange', 'Staking Protocol'], ['100% Remote Choice', 'Bitcoin Payroll Option', 'Health']],
  ['Ripple', '', 'High-Growth Tech Unicorn', 1.34, 10, 20, 14, 1.28, 4.2, 'San Francisco, CA, USA', 'XRP', ['Cross-Border Payments', 'XRP Ledger'], ['Annual Bonus Plan', 'Medical Coverage', 'Equity']],
  ['Checkout.com', '', 'High-Growth Tech Unicorn', 1.32, 10, 20, 14, 1.25, 4.1, 'London, UK', 'CKO', ['Enterprise Global Payments', 'Fraud Tech'], ['UK Pension Matching', 'Health Cover', 'Stock Options']],
  ['Klarna', '', 'High-Growth Tech Unicorn', 1.28, 10, 20, 14, 1.22, 4.0, 'Stockholm, Sweden', 'KLAR', ['Buy Now Pay Later (BNPL)', 'AI Shopping'], ['Swedish Health Benefits', 'Stock Options', 'Parental Pay']],
  ['Affirm', 'AFRM', 'High-Growth Tech Unicorn', 1.35, 10, 20, 14, 1.32, 4.2, 'San Francisco, CA, USA', 'AFRM', ['Point of Sale Financing', 'BNPL'], ['Remote Work Stipend', 'Health Benefits', 'RSUs']],
  ['Revolut', '', 'High-Growth Tech Unicorn', 1.34, 10, 20, 14, 1.25, 4.0, 'London, UK', 'REV', ['Global Neobank', 'Crypto & Forex'], ['Stock Equity Grants', 'Flexible Working', 'Private Healthcare']],
  ['Monzo', '', 'High-Growth Tech Unicorn', 1.28, 10, 18, 13, 1.20, 4.3, 'London, UK', 'MONZO', ['Digital Banking App', 'UK Current Accounts'], ['Remote Choice', 'Learning Budget', 'Health Insurance']],
  ['Wise', 'WISE', 'FinTech & Banking', 1.30, 10, 18, 13, 1.22, 4.4, 'London, UK', 'WISE', ['International Money Transfers', 'Multi-Currency'], ['Stock Options (Wise Shares)', 'Sabbatical after 4 yrs', 'Health']],
  ['Chime', '', 'High-Growth Tech Unicorn', 1.36, 10, 20, 14, 1.32, 4.2, 'San Francisco, CA, USA', 'CHIME', ['Consumer Mobile Banking', 'SpotMe'], ['Equity Package', 'Wellness Benefits', 'Parental Support']],
  ['SoFi', 'SOFI', 'FinTech & Banking', 1.30, 10, 20, 14, 1.24, 4.1, 'San Francisco, CA, USA', 'SOFI', ['Digital Lending', 'Invest & Banking'], ['401k Match', 'Tuition Loan Discounts', 'Stock Awards']],
  ['Brex', '', 'High-Growth Tech Unicorn', 1.38, 10, 20, 14, 1.35, 4.2, 'San Francisco, CA, USA', 'BREX', ['Corporate Credit Cards', 'Spend Management'], ['Competitive Equity', 'Health Care', 'Remote Stipend']],
  ['Ramp', '', 'High-Growth Tech Unicorn', 1.45, 10, 20, 15, 1.45, 4.5, 'New York, NY, USA', 'RAMP', ['Finance Automation', 'Corporate Cards'], ['Top Tier Pre-IPO Equity', 'Gourmet Meals', 'Top Health']],
  ['Toast', 'TOST', 'Enterprise Cloud', 1.28, 10, 20, 14, 1.22, 4.1, 'Boston, MA, USA', 'TOST', ['Restaurant POS Cloud', 'Fintech Platform'], ['401k Matching', 'RSU Grants', 'Comprehensive Medical']],
  ['Bill.com', 'BILL', 'Enterprise Cloud', 1.28, 10, 20, 14, 1.22, 4.2, 'San Jose, CA, USA', 'BILL', ['Automated Back-Office Payments', 'Invoicing'], ['Hybrid Flexibility', 'Health Care', 'Stock Purchase']],
  ['Marqeta', 'MQ', 'FinTech & Banking', 1.26, 8, 18, 12, 1.18, 4.0, 'Oakland, CA, USA', 'MQ', ['Modern Card Issuing APIs', 'Tokenization'], ['Health Benefits', 'Remote Work Policy', '401k']],
  ['Shift4', 'FOUR', 'FinTech & Banking', 1.22, 8, 18, 12, 1.14, 4.0, 'Center Valley, PA, USA', 'FOUR', ['Integrated Payment Processing', 'SkyTab'], ['Performance Bonus', 'Stock Options', 'Medical Plan']],
  ['Remitly', 'RELY', 'FinTech & Banking', 1.24, 8, 18, 12, 1.16, 4.2, 'Seattle, WA, USA', 'RELY', ['Cross-Border Remittances', 'Mobile Payments'], ['Healthcare', 'Equity Grants', 'Parental Leave']],
  ['Circle', '', 'High-Growth Tech Unicorn', 1.36, 10, 20, 14, 1.30, 4.2, 'Boston, MA, USA', 'CRCL', ['USDC Stablecoin Infrastructure', 'Web3'], ['Crypto Compensation Option', 'Health Benefits', 'Remote Work']],

  // 6. Quantitative Trading & Wall Street Investment Banks (20)
  ['Citadel', '', 'FinTech & Banking', 1.75, 25, 60, 40, 1.30, 4.4, 'Miami, FL & Chicago, USA', 'CIT', ['Quantitative Hedge Fund', 'Market Making'], ['Industry-Leading Bonuses (40%+)', 'Full Healthcare', 'Gourmet Food']],
  ['Jane Street', '', 'FinTech & Banking', 1.80, 25, 70, 45, 1.20, 4.7, 'New York, NY, USA', 'JS', ['Quantitative Trading', 'OCaml Tech Stack'], ['Top Tier Base & Bonus (All-Cash)', 'No Vesting Waiting', 'Breakfast/Lunch']],
  ['Two Sigma', '', 'FinTech & Banking', 1.65, 20, 50, 32, 1.35, 4.4, 'New York, NY, USA', 'TSIG', ['Systematic Quantitative Investing', 'AI Research'], ['Discretionary Annual Bonus', 'Health Benefits', 'Education']],
  ['D.E. Shaw & Co.', '', 'FinTech & Banking', 1.68, 20, 55, 35, 1.30, 4.5, 'New York, NY, USA', 'DES', ['Quantitative Asset Management', 'Computation'], ['Lucrative Profit Sharing', 'Comprehensive Care', 'Top Facilities']],
  ['Bridgewater Associates', '', 'FinTech & Banking', 1.55, 15, 40, 25, 1.25, 4.0, 'Westport, CT, USA', 'BW', ['Global Macro Hedge Fund', 'Systematic Principles'], ['Annual Merit Bonus', 'Transportation', 'Healthcare']],
  ['Hudson River Trading', '', 'FinTech & Banking', 1.72, 20, 60, 38, 1.25, 4.6, 'New York, NY, USA', 'HRT', ['Automated High-Frequency Trading', 'C++ Low Latency'], ['Substantial Cash Bonuses', 'Unlimited Time Off', 'Free Meals']],
  ['Jump Trading', '', 'FinTech & Banking', 1.70, 20, 55, 36, 1.25, 4.5, 'Chicago, IL, USA', 'JUMP', ['Algorithmic Trading', 'Crypto Market Making'], ['High Performance Incentives', 'Full Healthcare', 'Onsite Chefs']],
  ['Point72', '', 'FinTech & Banking', 1.55, 15, 40, 25, 1.25, 4.2, 'Stamford, CT, USA', 'P72', ['Multi-Strategy Hedge Fund', 'Long/Short Equity'], ['Performance Bonus', 'Health Insurance', 'Retirement']],
  ['Millennium Management', '', 'FinTech & Banking', 1.60, 15, 45, 28, 1.25, 4.2, 'New York, NY, USA', 'MLN', ['Global Alternative Investment', 'Pod Model'], ['Discretionary Incentive Pool', 'Comprehensive Health', '401k']],
  ['Goldman Sachs', 'GS', 'FinTech & Banking', 1.40, 15, 35, 22, 1.20, 4.1, 'New York, NY, USA', 'GS', ['Investment Banking', 'Marquee Tech Platform'], ['Annual Performance Bonus', 'Tuition Assistance', 'Global Network']],
  ['Morgan Stanley', 'MS', 'FinTech & Banking', 1.36, 12, 30, 20, 1.18, 4.1, 'New York, NY, USA', 'MS', ['Wealth Management', 'Institutional Securities'], ['Discretionary Bonus', 'Medical Insurance', 'Pension / 401k']],
  ['JPMorgan Chase', 'JPM', 'FinTech & Banking', 1.38, 12, 32, 20, 1.20, 4.1, 'New York, NY, USA', 'JPM', ['Wholesale Payments', 'Retail Chase Tech'], ['Annual Incentive Award', 'Healthcare Package', 'Retirement Match']],
  ['Bank of America', 'BAC', 'FinTech & Banking', 1.28, 10, 25, 16, 1.15, 4.0, 'Charlotte, NC, USA', 'BAC', ['Global Banking & Markets', 'Consumer Tech'], ['Performance Incentive', 'Tuition Reimbursement', '401k']],
  ['Citi', 'C', 'FinTech & Banking', 1.28, 10, 25, 16, 1.14, 3.9, 'New York, NY, USA', 'CITI', ['Treasury & Trade Solutions', 'Global Consumer'], ['Annual Incentive Award', 'Health Benefits', 'Flexible Hours']],
  ['Barclays', 'BARC', 'FinTech & Banking', 1.26, 10, 25, 16, 1.12, 4.0, 'London, UK', 'BARC', ['Investment Bank Tech', 'UK Consumer Card'], ['UK Pension Scheme', 'Discretionary Bonus', 'Healthcare']],
  ['HSBC', 'HSBA', 'FinTech & Banking', 1.24, 8, 22, 14, 1.10, 3.9, 'London, UK', 'HSBC', ['International Wealth', 'Commercial Banking Tech'], ['Global Mobility', 'Health Insurance', 'Retirement Scheme']],
  ['UBS', 'UBS', 'FinTech & Banking', 1.34, 12, 28, 18, 1.18, 4.1, 'Zurich, Switzerland', 'UBS', ['Swiss Wealth Management', 'Global Banking'], ['Swiss Pension Fund', 'Annual Bonus', 'Healthcare']],
  ['Deutsche Bank', 'DB', 'FinTech & Banking', 1.25, 10, 24, 15, 1.12, 3.9, 'Frankfurt, Germany', 'DB', ['Corporate Bank', 'Investment Bank Tech'], ['German Pension', 'Discretionary Bonus', 'Health Coverage']],
  ['BlackRock', 'BLK', 'FinTech & Banking', 1.36, 12, 28, 18, 1.25, 4.3, 'New York, NY, USA', 'BLK', ['Aladdin Enterprise Platform', 'Asset Management'], ['Annual Incentive Plan', 'Comprehensive Medical', 'Parental Leave']],
  ['Capital One', 'COF', 'FinTech & Banking', 1.34, 10, 22, 15, 1.25, 4.3, 'McLean, VA, USA', 'COF', ['Credit Card Technology', '100% AWS Cloud Tech'], ['Annual Performance Bonus', '401k 7.5% Match', 'Tuition Aid']],

  // 7. Mobility, Travel & E-Commerce (20)
  ['Uber', 'UBER', 'High-Growth Tech Unicorn', 1.40, 10, 22, 15, 1.42, 4.2, 'San Francisco, CA, USA', 'UBER', ['Mobility Platform', 'Delivery Logistics'], ['Uber Credits ($300+/mo)', 'Annual RSUs', 'Health Savings']],
  ['Lyft', 'LYFT', 'High-Growth Tech Unicorn', 1.32, 8, 18, 12, 1.25, 4.1, 'San Francisco, CA, USA', 'LYFT', ['Rideshare', 'Autonomous Vehicles Integration'], ['Lyft Credits', 'Health Benefits', 'Remote Flexibility']],
  ['Airbnb', 'ABNB', 'High-Growth Tech Unicorn', 1.42, 10, 20, 14, 1.45, 4.3, 'San Francisco, CA, USA', 'ABNB', ['Hospitality Platform', 'Travel Tech'], ['Live & Work Anywhere', '$2,000 Travel Credit/yr', 'Equity']],
  ['DoorDash', 'DASH', 'High-Growth Tech Unicorn', 1.40, 10, 20, 14, 1.40, 4.1, 'San Francisco, CA, USA', 'DASH', ['On-Demand Delivery', 'Merchant Platform'], ['DashPass & Food Credits', 'Equity Grants', 'Health Care']],
  ['Instacart', 'CART', 'High-Growth Tech Unicorn', 1.36, 10, 20, 14, 1.32, 4.1, 'San Francisco, CA, USA', 'CART', ['Grocery E-Commerce', 'Retail Logistics'], ['Instacart Express & Credits', 'Health Benefits', 'Remote Work']],
  ['Booking.com', 'BKNG', 'Enterprise Cloud', 1.30, 10, 20, 14, 1.22, 4.2, 'Amsterdam, Netherlands', 'BKNG', ['Online Travel Booking', 'Agoda / Kayak'], ['Dutch Pension Benefits', 'Travel Discounts', 'Health Insurance']],
  ['Expedia Group', 'EXPE', 'Enterprise Cloud', 1.28, 10, 20, 14, 1.20, 4.1, 'Seattle, WA, USA', 'EXPE', ['Travel Platform (VRBO, Hotels.com)', 'APIs'], ['Travel Reimbursements', '401k Match', 'Health Insurance']],
  ['Shopify', 'SHOP', 'Enterprise Cloud', 1.38, 5, 15, 10, 1.35, 4.3, 'Ottawa, Canada', 'SHOP', ['E-Commerce SaaS', 'Checkout Network'], ['Flex Compensation (Choose Cash/Equity)', 'Home Setup Fund']],
  ['Wayfair', 'W', 'Enterprise Cloud', 1.26, 8, 18, 12, 1.18, 3.9, 'Boston, MA, USA', 'WAY', ['Furniture E-Commerce', 'Supply Chain Tech'], ['Employee Product Discounts', 'Health Insurance', '401k']],
  ['MercadoLibre', 'MELI', 'Enterprise Cloud', 1.32, 10, 22, 15, 1.25, 4.3, 'Buenos Aires & São Paulo', 'MELI', ['Latin American E-Commerce', 'Mercado Pago'], ['Stock Grants', 'Flexible Working', 'Health Coverage']],
  ['Coupang', 'CPNG', 'Enterprise Cloud', 1.34, 10, 22, 15, 1.30, 4.0, 'Seoul, South Korea & Seattle', 'CPNG', ['Rocket Delivery', 'E-Commerce Platform'], ['Stock Equity Grants', 'Health Benefits', 'Relocation']],
  ['Grab', 'GRAB', 'High-Growth Tech Unicorn', 1.28, 10, 20, 14, 1.22, 4.1, 'Singapore', 'GRAB', ['Southeast Asia Superapp', 'GrabPay'], ['Grab Credits', 'Medical Insurance', 'Parental Leave']],
  ['GoTo', '', 'High-Growth Tech Unicorn', 1.22, 8, 18, 12, 1.15, 4.0, 'Jakarta, Indonesia', 'GOTO', ['Gojek On-Demand', 'Tokopedia E-Commerce'], ['Meal Allowance', 'Health Benefits', 'Flexible Hours']],
  ['Sea Group (Shopee)', 'SE', 'Enterprise Cloud', 1.28, 10, 20, 14, 1.22, 4.0, 'Singapore', 'SEA', ['Shopee E-Commerce', 'Garena Gaming'], ['Medical Coverage', 'Annual Bonus', 'Employee Discounts']],
  ['eBay', 'EBAY', 'Enterprise Cloud', 1.28, 10, 20, 14, 1.20, 4.1, 'San Jose, CA, USA', 'EBAY', ['Global Marketplace', 'Managed Payments'], ['ESPP', 'Sabbaticals', 'Tuition Assistance', 'Health Care']],
  ['Etsy', 'ETSY', 'Enterprise Cloud', 1.32, 10, 20, 14, 1.25, 4.3, 'Brooklyn, NY, USA', 'ETSY', ['Handmade Marketplace', 'Search / Recommender'], ['26 Weeks Parental Leave', 'Remote Choice', 'Wellness Fund']],
  ['Walmart Global Tech', 'WMT', 'Enterprise Cloud', 1.26, 8, 18, 12, 1.18, 4.1, 'Bentonville, AR & Sunnyvale', 'WMT', ['Retail AI', 'Supply Chain Automation'], ['Associate Stock Purchase Plan', 'Health Care', 'Discounts']],
  ['Target Tech', 'TGT', 'Enterprise Cloud', 1.24, 8, 18, 12, 1.15, 4.1, 'Minneapolis, MN, USA', 'TGT', ['Omnichannel Retail Tech', 'Shipt Logistics'], ['Target Store Discounts', 'Healthcare', '401k Matching']],
  ['Rakuten', '', 'Enterprise Cloud', 1.22, 10, 20, 14, 1.12, 4.0, 'Tokyo, Japan', 'RAK', ['Japanese E-Commerce', 'Rakuten Mobile 5G'], ['Free Cafeteria Meals', 'Stock Options', 'Healthcare']],
  ['Zalando', '', 'Enterprise Cloud', 1.24, 8, 18, 12, 1.14, 4.2, 'Berlin, Germany', 'ZAL', ['European Fashion Platform', 'Logistics AI'], ['Zalando Discounts', 'Public Transit Ticket', 'German Pension']],

  // 8. Global IT Services, Consulting & System Integrators (25)
  ['Tata Consultancy Services (TCS)', 'TCS', 'Global IT & Consulting', 0.95, 5, 15, 10, 0.50, 3.9, 'Mumbai, India', 'TCS', ['Enterprise IT Services', 'Digital Transformation'], ['High Job Security', 'TCS Digital/Prime Premiums', 'Mediclaim']],
  ['Infosys', 'INFY', 'Global IT & Consulting', 0.96, 5, 15, 10, 0.55, 3.9, 'Bangalore, India', 'INFY', ['IT Consulting', 'Finacle Core Banking'], ['Power Programmer Fast Track (2x)', 'Springboard Learning', 'Health']],
  ['Wipro', 'WIT', 'Global IT & Consulting', 0.94, 5, 14, 9, 0.50, 3.7, 'Bangalore, India', 'WIP', ['Cloud Infrastructure', 'Consulting'], ['Turbo/Elite Specialization Bonus', 'Mediclaim', 'Education']],
  ['HCL Technologies', 'HCLTECH', 'Global IT & Consulting', 0.95, 6, 15, 10, 0.50, 3.8, 'Noida, India', 'HCL', ['Engineering R&D', 'Enterprise Cloud'], ['HCL Software Division Premiums', 'Health Insurance', 'Rewards']],
  ['Tech Mahindra', 'TECHM', 'Global IT & Consulting', 0.93, 5, 14, 9, 0.50, 3.7, 'Pune, India', 'TECHM', ['Telecom & 5G', 'Digital Engineering'], ['5G Specialized Projects', 'Medical Insurance', 'Global Deputations']],
  ['Cognizant', 'CTSH', 'Global IT & Consulting', 0.97, 5, 15, 10, 0.60, 3.8, 'Teaneck, NJ, USA', 'CTSH', ['Healthcare IT', 'Digital Engineering'], ['Competitive Group Insurance', 'Annual Merit Cycles', 'Reimbursements']],
  ['LTIMindtree', 'LTIM', 'Global IT & Consulting', 0.98, 6, 16, 10, 0.60, 4.0, 'Mumbai, India', 'LTIM', ['Enterprise Digital Solutions', 'Cloud Migration'], ['Skill Allowances', 'Health Cover', 'Flexible Working']],
  ['Mphasis', 'MPHASIS', 'Global IT & Consulting', 0.95, 5, 15, 10, 0.50, 3.8, 'Bangalore, India', 'MPHAS', ['Banking & Financial IT', 'Cloud Native'], ['Medical Cover', 'Upskilling Certifications', 'Rewards']],
  ['Persistent Systems', 'PERSISTENT', 'Global IT & Consulting', 1.02, 8, 16, 11, 0.70, 4.2, 'Pune, India', 'PERS', ['Digital Engineering', 'Software Product Dev'], ['Higher-than-average Services Pay', 'Health Benefits', 'ESOPs']],
  ['Hexaware Technologies', '', 'Global IT & Consulting', 0.96, 6, 15, 10, 0.55, 3.9, 'Navi Mumbai, India', 'HEXA', ['Automation-Led IT', 'Cloud Services'], ['Performance Bonus', 'Group Mediclaim', 'Training']],
  ['Coforge', 'COFORGE', 'Global IT & Consulting', 1.00, 6, 16, 10, 0.65, 4.1, 'Noida, India', 'COFOR', ['Aviation & Insurance IT', 'Pega & Cloud'], ['Retention Bonus', 'Medical Insurance', 'Flexible Hybrid']],
  ['Cyient', 'CYIENT', 'Global IT & Consulting', 0.94, 5, 14, 9, 0.50, 3.8, 'Hyderabad, India', 'CYIENT', ['Engineering & Geospatial Tech', 'Aerospace'], ['Health Insurance', 'Skill Development', 'Global Projects']],
  ['KPIT Technologies', 'KPITTECH', 'Global IT & Consulting', 1.04, 8, 18, 12, 0.75, 4.1, 'Pune, India', 'KPIT', ['Automotive Software', 'Autonomous Driving'], ['Automotive Embedded Premiums', 'Health Cover', 'R&D']],
  ['Birlasoft', 'BSOFT', 'Global IT & Consulting', 0.94, 5, 14, 9, 0.50, 3.8, 'Pune, India', 'BSOFT', ['Manufacturing & BFSI IT', 'Enterprise Cloud'], ['Health Insurance', 'Performance Incentives', 'Certifications']],
  ['Zensar Technologies', 'ZENSARTECH', 'Global IT & Consulting', 0.94, 5, 14, 9, 0.50, 3.8, 'Pune, India', 'ZENSAR', ['Digital Experience', 'Infrastructure Management'], ['Group Medical Insurance', 'Rewards', 'Hybrid Model']],
  ['Tata Elxsi', 'TATAELXSI', 'Global IT & Consulting', 1.05, 8, 18, 12, 0.80, 4.1, 'Bangalore, India', 'ELXSI', ['Design & Technology', 'Automotive & Healthcare'], ['Higher Design/Embedded Compensation', 'Health Care', 'Perks']],
  ['Sonata Software', 'SONATSOFTW', 'Global IT & Consulting', 0.95, 5, 15, 10, 0.55, 3.9, 'Bangalore, India', 'SONATA', ['Modernization Engineering', 'Microsoft Cloud'], ['Health Insurance', 'Bonus Incentives', 'Learning']],
  ['UST Global', '', 'Global IT & Consulting', 0.97, 6, 16, 10, 0.60, 4.0, 'Aliso Viejo, CA & Trivandrum', 'UST', ['Digital Transformation', 'Semiconductor Services'], ['Great Work Culture', 'Medical Insurance', 'Global Mobility']],
  ['DXC Technology', 'DXC', 'Global IT & Consulting', 0.94, 5, 15, 9, 0.50, 3.7, 'Ashburn, VA, USA', 'DXC', ['IT Outsourcing', 'Modern Workplace'], ['Health Insurance', '401k/PF Matching', 'Tuition Aid']],
  ['NTT DATA', '', 'Global IT & Consulting', 0.98, 6, 16, 10, 0.60, 4.0, 'Tokyo, Japan', 'NTT', ['Global IT Infrastructure', 'Telecom Services'], ['Healthcare', 'Retirement Pension', 'Certifications Support']],
  ['Capgemini', 'CAP', 'Global IT & Consulting', 0.98, 6, 16, 10, 0.60, 3.9, 'Paris, France', 'CAP', ['Cloud Engineering', 'Consulting'], ['Flexible Benefits Plan', 'Employee Share Ownership', 'Health']],
  ['Accenture', 'ACN', 'Global IT & Consulting', 1.08, 8, 18, 12, 0.85, 4.1, 'Dublin, Ireland', 'ACN', ['Management Consulting', 'Cloud Architecture'], ['Discretionary Annual Bonus', 'Global Client Exposure', 'ESPP']],
  ['Deloitte', '', 'Global IT & Consulting', 1.10, 10, 20, 14, 0.75, 4.0, 'London & New York', 'D', ['Advisory & Tech Consulting', 'Cyber Risk'], ['Annual Performance Bonus', 'Tuition Sponsorship', 'Well-being Subsidy']],
  ['PwC (PricewaterhouseCoopers)', '', 'Global IT & Consulting', 1.08, 10, 20, 14, 0.70, 4.0, 'London, UK', 'PWC', ['Technology Consulting', 'Cloud Transformation'], ['Annual Merit Bonus', 'Student Loan Paydown', 'Health Plan']],
  ['EY (Ernst & Young)', '', 'Global IT & Consulting', 1.08, 10, 20, 14, 0.70, 4.0, 'London, UK', 'EY', ['Technology Advisory', 'Enterprise Risk'], ['Wellness Fund', 'Parental Support', 'Certification Reimbursements']],

  // 9. Indian Product, FinTech & Unicorn Tech Champions (20)
  ['Zoho', '', 'Enterprise Cloud', 1.10, 8, 18, 12, 0.80, 4.4, 'Chennai, India', 'ZOHO', ['SaaS Suite', 'CRM', 'Productivity'], ['Work-Life Balance', 'Free Organic Food', 'Rural Offices', 'No Layoff Policy']],
  ['Freshworks', 'FRSH', 'Enterprise Cloud', 1.20, 10, 20, 14, 1.22, 4.1, 'San Mateo, CA & Chennai', 'FRSH', ['Customer Engagement SaaS', 'ITSM'], ['US-Listed RSUs', 'Wellness Reimbursement', 'Hybrid Culture']],
  ['Flipkart', '', 'Enterprise Cloud', 1.35, 10, 22, 15, 1.30, 4.2, 'Bangalore, India', 'FLIP', ['E-Commerce Marketplace', 'Cleartrip'], ['Above-Market Indian Base', 'ESOPs', 'Family Medical Insurance']],
  ['Swiggy', 'SWIGGY', 'Enterprise Cloud', 1.32, 10, 20, 14, 1.25, 4.1, 'Bangalore, India', 'SWIG', ['On-Demand Food Delivery', 'Instamart'], ['ESOP Liquidity Events', 'Medical Insurance', 'Food Discounts']],
  ['Zomato', 'ZOMATO', 'Enterprise Cloud', 1.32, 10, 20, 14, 1.25, 4.1, 'Gurgaon, India', 'ZOM', ['Food Tech Marketplace', 'Blinkit Quick Commerce'], ['Top Tier Base Pay', 'ESOPs', 'Period Leave', 'Health Cover']],
  ['Paytm', 'PAYTM', 'FinTech & Banking', 1.18, 8, 18, 12, 1.00, 3.8, 'Noida, India', 'PAYTM', ['Digital Payments', 'Soundbox', 'Lending'], ['ESOP Grant Options', 'Medical Insurance', 'Performance Incentive']],
  ['Razorpay', '', 'High-Growth Tech Unicorn', 1.38, 10, 20, 15, 1.35, 4.4, 'Bangalore, India', 'RAZOR', ['Payments Gateway', 'Neobanking Platform'], ['100% Health Cover for Family', 'ESOP Buybacks', 'Learning Budget']],
  ['CRED', '', 'High-Growth Tech Unicorn', 1.44, 10, 20, 15, 1.40, 4.3, 'Bangalore, India', 'CRED', ['Credit Card Rewards', 'Fintech Platform'], ['Top 1% Engineering Pay in India', 'Generous ESOPs', 'Premium Meals']],
  ['Meesho', '', 'High-Growth Tech Unicorn', 1.34, 10, 20, 14, 1.30, 4.2, 'Bangalore, India', 'MEESH', ['Social E-Commerce', 'Logistics Platform'], ['Boundaryless Work (100% Remote)', 'ESOPs', 'Health Care']],
  ['Zerodha', '', 'FinTech & Banking', 1.45, 15, 30, 20, 0.90, 4.7, 'Bangalore, India', 'ZERO', ['Discount Stock Brokerage', 'Kite Platform'], ['Highest Cash Stability & Profit Bonuses', 'Gym Incentives', 'No Burnout']],
  ['Groww', '', 'FinTech & Banking', 1.36, 10, 20, 14, 1.32, 4.3, 'Bangalore, India', 'GROWW', ['Mutual Funds', 'Stock Trading Platform'], ['Competitive ESOPs', 'Health Insurance', 'Rapid Growth']],
  ['PhonePe', '', 'FinTech & Banking', 1.38, 10, 20, 15, 1.35, 4.3, 'Bangalore, India', 'PHONE', ['UPI Market Leader', 'Insurance & Wealth'], ['Walmart Backed Compensation', 'High Base Pay', 'Parental Perks']],
  ['Ola Cabs', '', 'High-Growth Tech Unicorn', 1.25, 8, 18, 12, 1.10, 3.7, 'Bangalore, India', 'OLA', ['Mobility Platform', 'Ola Electric Scooters'], ['Health Insurance', 'Vehicle Discounts', 'Performance Bonuses']],
  ['InMobi', '', 'High-Growth Tech Unicorn', 1.32, 10, 20, 14, 1.25, 4.2, 'Bangalore, India', 'INMOBI', ['Mobile Advertising Tech', 'Glance Lockscreen'], ['Global Exposure', 'ESOPs', 'Health Coverage', 'Hybrid Work']],
  ['Postman', '', 'High-Growth Tech Unicorn', 1.42, 10, 20, 14, 1.40, 4.5, 'San Francisco, CA & Bangalore', 'POST', ['API Development Platform', 'Workspace Tools'], ['Silicon Valley Pay in India', '100% Remote Option', 'Wellness Budget']],
  ['BrowserStack', '', 'High-Growth Tech Unicorn', 1.40, 10, 20, 14, 1.35, 4.4, 'Dublin & Mumbai', 'BSTK', ['Cloud Testing Infrastructure', 'Automated QA'], ['Top Indian Tech Salary', 'Remote Flexibility', 'Learning Stipends']],
  ['Hasura', '', 'High-Growth Tech Unicorn', 1.38, 10, 20, 14, 1.35, 4.4, 'San Francisco & Bangalore', 'HASURA', ['GraphQL Engine', 'Instant Data APIs'], ['Remote First', 'Generous Equity', 'Equipment Fund', 'Health']],
  ['Dream11', '', 'High-Growth Tech Unicorn', 1.40, 10, 22, 15, 1.35, 4.4, 'Mumbai, India', 'DREAM', ['Sports Tech Platform', 'High Concurrency'], ['Top Percentile Pay in India', 'Stadium Ticket Perks', 'Full Health']],
  ['Delhivery', 'DELHIVERY', 'Enterprise Cloud', 1.22, 8, 18, 12, 1.12, 4.0, 'Gurgaon, India', 'DELH', ['Logistics & Supply Chain Tech', 'Express Parcel'], ['ESOPs', 'Health Cover', 'Fast-paced Engineering']],
  ['Nykaa', 'NYKAA', 'Enterprise Cloud', 1.20, 8, 18, 12, 1.10, 4.0, 'Mumbai, India', 'NYKAA', ['Beauty & Fashion E-Commerce', 'Retail Tech'], ['Product Discounts', 'Medical Insurance', 'Performance Incentives']],

  // 10. Aerospace, Autonomous & Healthcare Tech (15)
  ['SpaceX', '', 'High-Growth Tech Unicorn', 1.38, 0, 15, 8, 1.55, 4.3, 'Hawthorne, CA & Starbase, TX', 'SPACEX', ['Aerospace Engineering', 'Starlink Satellite'], ['High Pre-IPO Equity Value', 'Medical Plan', 'Rocket Launches']],
  ['Blue Origin', '', 'Enterprise Cloud', 1.32, 8, 18, 12, 1.30, 4.1, 'Kent, WA, USA', 'BLUE', ['Space Exploration', 'New Shepard / Glenn'], ['Comprehensive Health', '401k Match', 'Tuition Assistance']],
  ['Boeing', 'BA', 'Enterprise Cloud', 1.18, 6, 16, 10, 1.05, 3.8, 'Arlington, VA, USA', 'BA', ['Commercial Airplanes', 'Defense & Space Tech'], ['Generous 401k Match (10%)', 'Pension Perks', 'Education Program']],
  ['Lockheed Martin', 'LMT', 'Enterprise Cloud', 1.22, 6, 16, 10, 1.08, 4.1, 'Bethesda, MD, USA', 'LMT', ['Aerospace Defense', 'Advanced Aeronautics (Skunk Works)'], ['4/10 Work Schedule (Every Friday Off)', '401k Match', 'Health']],
  ['Northrop Grumman', 'NOC', 'Enterprise Cloud', 1.22, 6, 16, 10, 1.08, 4.1, 'Falls Church, VA, USA', 'NOC', ['Defense Systems', 'Space Systems', 'Aeronautics'], ['9/80 Work Schedule', 'Retirement Plan', 'Tuition Assistance']],
  ['Waymo', '', 'Tier 1 Big Tech', 1.50, 12, 25, 18, 1.55, 4.5, 'Mountain View, CA, USA', 'WAYMO', ['Autonomous Driving', 'Robotaxi Fleet'], ['Alphabet Comp Structure (GSU Stock)', 'Top Health', 'Free Rides']],
  ['Cruise', '', 'Tier 1 Big Tech', 1.38, 10, 22, 15, 1.35, 4.0, 'San Francisco, CA, USA', 'CRUISE', ['Autonomous Vehicles', 'Robotaxi Tech'], ['GM Stock Grants', 'Health Benefits', 'Wellness Stipend']],
  ['Rivian', 'RIVN', 'High-Growth Tech Unicorn', 1.34, 5, 15, 10, 1.32, 4.0, 'Irvine, CA, USA', 'RIVN', ['Electric Trucks & SUVs', 'Automotive Software'], ['RSU Equity Grants', 'Health Insurance', 'Vehicle Discounts']],
  ['Lucid Motors', 'LCID', 'High-Growth Tech Unicorn', 1.32, 5, 15, 10, 1.28, 3.9, 'Newark, CA, USA', 'LCID', ['Luxury Electric Vehicles', 'Powertrain Tech'], ['Stock Grants', 'Medical & Vision', 'Parental Leave']],
  ['Epic Systems', '', 'Enterprise Cloud', 1.25, 8, 20, 14, 0.90, 4.2, 'Verona, WI, USA', 'EPIC', ['Healthcare Software', 'Electronic Health Records'], ['All-Cash Bonuses', 'Sabbaticals (4 weeks paid abroad)', 'Campuses']],
  ['Veeva Systems', 'VEEV', 'Enterprise Cloud', 1.32, 10, 20, 14, 1.25, 4.4, 'Pleasanton, CA, USA', 'VEEV', ['Life Sciences Cloud', 'Clinical Data'], ['Work Anywhere Policy', 'Stock Purchase', 'Health Care']],
  ['Illumina', 'ILMN', 'Hardware & Semiconductor', 1.28, 8, 18, 12, 1.20, 4.1, 'San Diego, CA, USA', 'ILMN', ['DNA Sequencing Tech', 'Genomics Software'], ['Annual Incentive Bonus', 'ESPP', 'Tuition Reimbursement']],
  ['Tempus AI', 'TEM', 'Enterprise Cloud', 1.35, 10, 20, 14, 1.30, 4.2, 'Chicago, IL, USA', 'TEM', ['Precision Medicine', 'Clinical Data AI'], ['Equity Packages', 'Health Coverage', 'Home Setup']],
  ['Moderna', 'MRNA', 'Enterprise Cloud', 1.30, 10, 22, 15, 1.22, 4.2, 'Cambridge, MA, USA', 'MRNA', ['mRNA Biotech', 'AI Computational Biology'], ['Discretionary Bonus', 'Comprehensive Health', '401k Match']],
  ['Flatiron Health', '', 'Enterprise Cloud', 1.32, 10, 20, 14, 1.25, 4.2, 'New York, NY, USA', 'FLAT', ['Oncology Data Analytics', 'Clinical Tech'], ['Roche Benefits Umbrella', 'Health Insurance', 'Remote Flexibility']]
];

console.log('Total companies compiled:', companyList.length);

const out = [];
out.push(`export interface CompanyProfile {
  name: string
  ticker?: string
  tier: string
  compensationMultiplier: number
  bonusRangePercent: { min: number; max: number; average: number }
  stockGrantMultiplier: number
  hiringRating: number
  benefitsHighlights: string[]
  hiringStatus: 'Aggressive' | 'Selective' | 'Steady'
  headquarters: string
  logoText: string
  primaryIndustries: string[]
}

export const COMPANIES_DATABASE: CompanyProfile[] = [`);

for (const c of companyList) {
  const [name, ticker, tier, comp, bMin, bMax, bAvg, stock, rating, hq, logo, ind, perks] = c;
  out.push(`  {
    name: ${JSON.stringify(name)},
    ${ticker ? `ticker: ${JSON.stringify(ticker)},` : ''}
    tier: ${JSON.stringify(tier)},
    compensationMultiplier: ${comp},
    bonusRangePercent: { min: ${bMin}, max: ${bMax}, average: ${bAvg} },
    stockGrantMultiplier: ${stock},
    hiringRating: ${rating},
    benefitsHighlights: ${JSON.stringify(perks)},
    hiringStatus: '${rating >= 4.4 ? 'Aggressive' : rating >= 4.1 ? 'Selective' : 'Steady'}',
    headquarters: ${JSON.stringify(hq)},
    logoText: ${JSON.stringify(logo)},
    primaryIndustries: ${JSON.stringify(ind)}
  },`);
}

out.push(`];

export function getCompanyProfile(companyName: string): CompanyProfile {
  if (!companyName) {
    return {
      name: 'Standard Market Baseline',
      tier: 'Enterprise Cloud',
      compensationMultiplier: 1.0,
      bonusRangePercent: { min: 8, max: 15, average: 10 },
      stockGrantMultiplier: 1.0,
      hiringRating: 4.0,
      benefitsHighlights: ['Standard Health Insurance', 'Annual Merit Reviews', 'Paid Time Off', 'Professional Development'],
      hiringStatus: 'Steady',
      headquarters: 'Global',
      logoText: 'SMB',
      primaryIndustries: ['Technology & Software']
    };
  }

  const normalized = companyName.trim().toLowerCase();
  const matched = COMPANIES_DATABASE.find(c => {
    const cNorm = c.name.toLowerCase();
    return cNorm === normalized || cNorm.includes(normalized) || normalized.includes(cNorm);
  });

  if (matched) return matched;

  const isStartup = /startup|labs|technologies|ai|robotics|protocol|ventures/i.test(companyName);
  const isConsulting = /consulting|solutions|services|infotech|global/i.test(companyName);

  if (isStartup) {
    return {
      name: companyName,
      tier: 'High-Growth Tech Unicorn',
      compensationMultiplier: 1.15,
      bonusRangePercent: { min: 5, max: 15, average: 10 },
      stockGrantMultiplier: 1.25,
      hiringRating: 4.1,
      benefitsHighlights: ['Startup Equity Upside', 'Flexible Work', 'Rapid Ownership', 'Health Benefits'],
      hiringStatus: 'Aggressive',
      headquarters: 'Regional Tech Hub',
      logoText: companyName.slice(0, 3).toUpperCase(),
      primaryIndustries: ['High-Growth Innovation']
    };
  }

  if (isConsulting) {
    return {
      name: companyName,
      tier: 'Global IT & Consulting',
      compensationMultiplier: 0.96,
      bonusRangePercent: { min: 5, max: 15, average: 9 },
      stockGrantMultiplier: 0.6,
      hiringRating: 3.8,
      benefitsHighlights: ['Client Project Variety', 'Group Health Cover', 'Certifications Support', 'Hybrid Model'],
      hiringStatus: 'Steady',
      headquarters: 'Global Services Hub',
      logoText: companyName.slice(0, 3).toUpperCase(),
      primaryIndustries: ['IT & Enterprise Solutions']
    };
  }

  return {
    name: companyName,
    tier: 'Enterprise Cloud',
    compensationMultiplier: 1.02,
    bonusRangePercent: { min: 8, max: 16, average: 11 },
    stockGrantMultiplier: 1.0,
    hiringRating: 4.0,
    benefitsHighlights: ['Competitive Health Coverage', 'Annual Bonus Plan', 'Hybrid Model', 'Growth Stipend'],
    hiringStatus: 'Steady',
    headquarters: 'Regional Office',
    logoText: companyName.slice(0, 3).toUpperCase(),
    primaryIndustries: ['Industry Tech']
  };
}
`);

const targetPath = path.join(__dirname, '..', 'lib', 'salary-predictor', 'companies-data.ts');
fs.writeFileSync(targetPath, out.join('\n'), 'utf8');
console.log('SUCCESS: Written', companyList.length, 'companies to', targetPath);
