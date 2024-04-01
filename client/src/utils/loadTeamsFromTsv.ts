import Student from "@/models/Student/Student";
import Team from "@/models/Team/Team";

function processStudentsFromTSV(tsvData: string): Student[] | string {
    const lines = tsvData.split('\n');

    const students: Student[] = [];
    const teams: Team[] = [];
    
    let lineCounter = 1;
    for (const line of lines) {
        
      if(line.split('\t').length != 4){
        return `Parsing error: not 4 elements on line ${lineCounter}`
      }
      const [name, login, xname, teamName] = line.split('\t');
      const student ={ } as Student;
      student.name = name;
      student.vutlogin = login;
      student.fitlogin = xname;

      var team = teams.find(t => t.name == teamName);

      if(team == undefined){
        team = {} as Team;
        team.name = teamName;
        team.studentIds = [];
      }

      students.push(student);

      //ERROR... ERROR I DONT HAVE ID
      team.studentIds.push(student.id);

      students.push(student);
      lineCounter = lineCounter + 1;
    }
  
    return students;
  }