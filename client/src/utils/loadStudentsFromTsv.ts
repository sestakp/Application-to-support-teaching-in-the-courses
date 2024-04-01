import Student from "@/models/Student/Student";

function processStudentsFromTSV(tsvData: string): Student[] | string {
    const lines = tsvData.split('\n');
    const students: Student[] = [];
    
    let lineCounter = 1;
    for (const line of lines) {
        
      if(line.split('\t').length != 3){
        return `Parsing error: not 3 elements on line ${lineCounter}`
      }
      const [name, login, xname] = line.split('\t');
      const student ={ } as Student;
      student.name = name;
      student.vutlogin = login;
      student.fitlogin = xname;

      students.push(student);
      lineCounter = lineCounter + 1;
    }
  
    return students;
  }