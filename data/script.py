import re
import ast
import json

def js_to_python(js_str):
    # Replace JavaScript true/false with Python True/False
    js_str = js_str.replace('true', 'True').replace('false', 'False')
    # Replace null with None
    js_str = js_str.replace('null', 'None')
    return js_str

def transform_job_data(jobs):
    for job in jobs:
        tasks = job.pop('tasks', [])
        materials = job.pop('materials', [])
        
        # Distribute tasks and materials among phases
        for item_list in [tasks, materials]:
            while item_list:
                for phase in job['phases']:
                    if item_list:
                        item = item_list.pop(0)
                        if 'tasks' not in phase:
                            phase['tasks'] = []
                        if 'materials' not in phase:
                            phase['materials'] = []
                        if item in tasks:
                            phase['tasks'].append(item)
                        else:
                            phase['materials'].append(item)
        
        # Add empty notes to each phase
        for phase in job['phases']:
            phase['note'] = []

    return jobs

# Read the input file
with open('jobsData.tsx', 'r') as file:
    content = file.read()

# Extract the jobs array from the content
jobs_match = re.search(r'export const jobs: Job\[\] = (\[[\s\S]*?\]);', content)
if jobs_match:
    jobs_str = jobs_match.group(1)
else:
    raise ValueError("Couldn't find jobs array in the file")

# Convert JavaScript syntax to Python
jobs_str = js_to_python(jobs_str)

# Safely evaluate the string as a Python literal
try:
    jobs = ast.literal_eval(jobs_str)
except (SyntaxError, ValueError) as e:
    print(f"Error parsing jobs data: {e}")
    print("Problematic part of the string:")
    print(jobs_str[max(0, e.offset - 50):min(len(jobs_str), e.offset + 50)])
    raise

# Transform the job data
transformed_jobs = transform_job_data(jobs)

# Create the new content
new_content = f"export const jobs: Job[] = {json.dumps(transformed_jobs, indent=2)}"

# Write the transformed data back to the file
with open('jobsData.tsx', 'w') as file:
    file.write(new_content)

print("Job data has been successfully transformed and written back to jobsData.tsx")