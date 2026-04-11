import { prisma } from '@/lib/prisma'
import FormModal from './FormModal'
import { currentUserId, role } from '@/lib/utils'

export type FormContainerProps = {
  table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement",
  type: "create" | "update" | "delete",
  data?: any,
  id?: number | string
}

const FormContainer = async ({table, type, data, id} : FormContainerProps) => {

  let relatedData = {}
  const userId = await currentUserId()
  const userRole = await role()

  if(type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        })
        relatedData = { teachers: subjectTeachers }
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true  },
        })
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true  },
        })
        relatedData = { teachers: classTeachers, grades: classGrades }
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true  },
        })
        relatedData = { subjects: teacherSubjects }
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true  },
        })
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: {students: true } } }
        })
        relatedData = { classes: studentClasses, grades: studentGrades  }
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(userRole === "teacher" ? {teacherId: userId! } : {})
          },
          select: {
            id: true,
            name: true
          }
        })
        relatedData = { lessons: examLessons  }
        break;
      case "parent":
        const parentStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { students: parentStudents };
        break;
      case "lesson":
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        const lessonTeachers = await prisma.teacher.findMany({
          where: {
            ...(userRole === "teacher" ? { id: userId! } : {}),
          },
          select: { id: true, name: true, surname: true },
        });

        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          classes: lessonClasses,
          teachers: lessonTeachers,
          subjects: lessonSubjects,
        };
        break;
      case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          where: {
            ...(userRole === "teacher"
              ? { teacherId: userId! }
              : userRole === "student"
              ? {
                  class: {
                    students: {
                      some: {
                        id: userId!
                      }
                    }
                  }
                }
              : {})
          },
          select: {
            id: true,
            name: true
          }
        });

        relatedData = { lessons: assignmentLessons };
        break;
        case "result":
        const students = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });

        const exams = await prisma.exam.findMany({
          where: {
            ...(userRole === "teacher"
              ? {
                  lesson: {
                    teacherId: userId!,
                  },
                }
              : {}),
          },
          select: { id: true, title: true },
        });

        const assignments = await prisma.assignment.findMany({
          where: {
            ...(userRole === "teacher"
              ? {
                  lesson: {
                    teacherId: userId!,
                  },
                }
              : {}),
          },
          select: { id: true, title: true },
        });

        relatedData = {
          students,
          exams,
          assignments,
        };
        break;
        case "event":
        const eventClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          classes: eventClasses,
        };
        break;
        case "announcement":
        const announcementClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          classes: announcementClasses,
        };
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData}/>
    </div>
  )
}

export default FormContainer
