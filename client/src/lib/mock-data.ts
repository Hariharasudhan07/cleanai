export const sampleColumns = [
  { key: "customer_id", label: "Customer ID", type: "string" },
  { key: "first_name", label: "First Name", type: "string" },
  { key: "last_name", label: "Last Name", type: "string" },
  { key: "email", label: "Email", type: "string" },
  { key: "phone_number", label: "Phone Number", type: "string" },
  { key: "address", label: "Address", type: "string" },
];

export const sampleData = [
  {
    customer_id: "CU001",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone_number: "(555) 123-4567",
    address: "123 Main St, New York, NY"
  },
  {
    customer_id: "CU002",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@company.org",
    phone_number: "555.234.5678",
    address: "456 Oak Ave, Los Angeles, CA"
  },
  {
    customer_id: "CU003",
    first_name: "Mike",
    last_name: "Johnson",
    email: "mjohnson@email.net",
    phone_number: "+1-555-345-6789",
    address: "789 Pine St, Chicago, IL"
  },
];

export const schemaColumns = [
  {
    name: "customer_id",
    type: "string",
    nullable: false,
    unique: "10,247",
    missing: "0 (0%)",
    samples: ["CU001", "CU002", "CU003"],
    issues: "Good",
    issueType: "success"
  },
  {
    name: "email",
    type: "string",
    nullable: true,
    unique: "9,892",
    missing: "47 (0.5%)",
    samples: ["john@example.com", "jane.doe@company.org"],
    issues: "Format Issues",
    issueType: "warning"
  },
  {
    name: "phone_number",
    type: "string",
    nullable: true,
    unique: "8,734",
    missing: "234 (2.3%)",
    samples: ["(555) 123-4567", "555.123.4568"],
    issues: "Multiple Formats",
    issueType: "error"
  },
];

export const ruleTemplates = [
  {
    id: "trim",
    name: "Trim Whitespace",
    description: "Remove leading/trailing spaces",
    icon: "tag",
    color: "blue"
  },
  {
    id: "case",
    name: "Case Normalize",
    description: "Standardize text case",
    icon: "case",
    color: "green"
  },
  {
    id: "regex",
    name: "Regex Replace",
    description: "Pattern-based replacements",
    icon: "code",
    color: "purple"
  },
  {
    id: "date",
    name: "Date Parsing",
    description: "Standardize date formats",
    icon: "calendar",
    color: "orange"
  },
];
