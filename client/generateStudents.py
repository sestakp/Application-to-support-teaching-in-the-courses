import random
from faker import Faker

fake = Faker()

def generate_login():
    # Generate a unique 6-digit random number for login
    return str(random.randint(100000, 999999))

def generate_second_login(name):
    # Generate a unique 2-digit random number for the second login
    two_digit_number = str(random.randint(10, 99))

    # Create the second login format
    return 'x' + name.split()[-1][:5].lower() + two_digit_number

def generate_team_nickname():
    # Generate a random team nickname
    return fake.simple_profile()['username']

def generate_tsv_file(num_students):
    studentLines = ["Full name\tvut login\tfit login"]
    teamLines = ["Full name\tvut login\tfit login\tteam name"]

    teamName = generate_team_nickname()

    for i in range(1, num_students + 1):
        full_name = fake.name()
        login = generate_login()
        second_login = generate_second_login(full_name)

        # Append the line to the list
        studentLines.append(f"{full_name}\t{login}\t{second_login}")

        if i % 5 == 0:
            teamName = generate_team_nickname()
        teamLines.append(f"{full_name}\t{login}\t{second_login}\t{teamName}")


    # Write the lines to a TSV file
    with open('students_data.tsv', 'w') as file:
        file.write('\n'.join(studentLines))


    with open('team_data.tsv', 'w') as file:
        file.write('\n'.join(teamLines))

if __name__ == "__main__":
    # Specify the number of students you want to generate
    num_students = 300

    generate_tsv_file(num_students)

    print(f"TSV file with {num_students} students generated successfully.")
