"use server";

import { revalidatePath } from "next/cache";
import { AnnouncementSchema, AssignmentSchema, ClassSchema, EventSchema, ExamSchema, LessonSchema, ParentSchema, ResultSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import { prisma } from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { currentUserId, role } from "./utils";

type currentState = {
  success: boolean,
  error: boolean
}


//subject actions
export const createSubject = async (
  currentState: currentState, 
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers?.map(teacherId => ({id: teacherId}))
        }
      }
    })
    // revalidatePath("/list/subjects")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateSubject = async (
  currentState: currentState, 
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id:  data.id
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers?.map(teacherId => ({id: teacherId}))
        }
      }
    })
    // revalidatePath("/list/subjects")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteSubject = async (
  currentState: currentState, 
  data: FormData
) => {
  try {

    const id = data.get("id") as string
    await prisma.subject.delete({
      where: {
        id: parseInt(id)
      }
    })
    // revalidatePath("/list/subjects")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}


//class actions

export const createClass= async (
  currentState: currentState, 
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data
    })
    // revalidatePath("/list/class")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateClass = async (
  currentState: currentState, 
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id:  data.id
      },
      data
    })
    // revalidatePath("/list/class")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteClass = async (
  currentState: currentState, 
  data: FormData
) => {
  try {

    const id = data.get("id") as string
    await prisma.class.delete({
      where: {
        id: parseInt(id)
      }
    })
    // revalidatePath("/list/class")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}


//teacher actions

export const createTeacher = async (
  currentState: currentState, 
  data: TeacherSchema
) => {
  try {
    const user = (await clerkClient()).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
    })
    await prisma.teacher.create({
      data: {
        id: (await user).id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId)
         })),
        }
      }
    })
    // revalidatePath("/list/teacher")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateTeacher = async (
  currentState: currentState, 
  data: TeacherSchema
) => {

  if(!data.id) {
    return { success: false, error: true }
  }
  try {
    const user = (await clerkClient()).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && {password: data.password}),
      firstName: data.name,
      lastName: data.surname,
    })
    await prisma.teacher.update({
      where: {
        id: data.id
      },
      data: {
        ...(data.password !== "" && {password: data.password}),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId)
         })),
        }
      }
    })
    // revalidatePath("/list/teachers")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteTeacher = async (
  currentState: currentState, 
  data: FormData
) => {
  try {
    const id = data.get("id") as string
    (await clerkClient()).users.deleteUser(id)

    await prisma.teacher.delete({
      where: {
        id: id
      }
    })
    // revalidatePath("/list/teacher")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}



//student actions 

export const createStudent = async (
  currentState: currentState, 
  data: StudentSchema
) => {
  try {

    const classItem = await prisma.class.findUnique({
      where: { id: data.classId},
      include: {
        _count: { select: { students: true}}
      }
    })

    if(classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true}
    }


    const user = (await clerkClient()).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
    })
    await prisma.student.create({
      data: {
        id: (await user).id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId
      }
    })
    // revalidatePath("/list/student")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateStudent = async (
  currentState: currentState, 
  data: StudentSchema
) => {

  if(!data.id) {
    return { success: false, error: true }
  }
  try {
    const user = (await clerkClient()).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && {password: data.password}),
      firstName: data.name,
      lastName: data.surname,
    })
    await prisma.student.update({
      where: {
        id: data.id
      },
      data: {
        ...(data.password !== "" && {password: data.password}),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId
      }
    })
    // revalidatePath("/list/student")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteStudent = async (
  currentState: currentState, 
  data: FormData
) => {
  try {

    const id = data.get("id") as string
    (await clerkClient()).users.deleteUser(id)

    await prisma.student.delete({
      where: {
        id: id
      }
    })
    // revalidatePath("/list/student")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}


//exam actions
export const createExam = async (
  currentState: currentState, 
  data: ExamSchema
) => {
  const userRole = await role()
  const userId = await currentUserId()

  try {
    if(userRole === "teacher"){

      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId
        }
      })
      
      if(!teacherLesson) {
        return { success: false, error: true }
      }
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      }
    })
    // revalidatePath("/list/exams")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateExam = async (
  currentState: currentState, 
  data: ExamSchema
) => {

  const userRole = await role()
  const userId = await currentUserId()

  try {
    if(userRole === "teacher") {

      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId
        }
      })
      
      if(!teacherLesson) {
        return { success: false, error: true }
      }
    }

    await prisma.exam.update({
      where: {
        id: data.id
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      }
    })
    // revalidatePath("/list/exams")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteExam = async (
  currentState: currentState, 
  data: FormData
) => {

  const userRole = await role()
  const userId = await currentUserId()

  try {

    const id = data.get("id") as string
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(userRole === "teacher" ? { lesson: { teacherId: userId! }} : {})
      }
    })
    // revalidatePath("/list/exams")
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}


//parent actions 

export const createParent = async (
  currentState: currentState,
  data: ParentSchema
) => {
  try {
    const user = await (await clerkClient()).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        students: {
          connect: data.students?.map((studentId: string) => ({
            id: studentId
         })),
        }
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateParent = async (
  currentState: currentState,
  data: ParentSchema
) => {
  if (!data.id) return { success: false, error: true };

  try {
    // Update Clerk user info
    await (await clerkClient()).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    // Only update parent details, NOT students (can't remove all students)
    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteParent = async (
  currentState: currentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    // Check if parent has students
    const studentCount = await prisma.student.count({
      where: { parentId: id },
    });

    if (studentCount > 0) {
      return {
        success: false,
        error: true,
      };
    }

    // Delete Clerk user
    await (await clerkClient()).users.deleteUser(id);

    // Delete parent in DB
    await prisma.parent.delete({ where: { id } });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};


//lesson actions

export const createLesson = async (
  currentState: currentState,
  data: LessonSchema
) => {
  const userRole = await role();
  const userId = await currentUserId();

  try {
    if (userRole === "teacher") {
      // Teacher can only create lesson for themselves
      if (data.teacherId !== userId) {
        return { success: false, error: true };
      }
    }

    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: currentState,
  data: LessonSchema
) => {
  const userRole = await role();
  const userId = await currentUserId();

  if(!data.id) {
    return { success: false, error: true}
  }

  try {
    if (userRole === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          id: data.id,
          teacherId: userId!,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.lesson.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: currentState,
  data: FormData
) => {
  const userRole = await role();
  const userId = await currentUserId();

  try {
    const id = data.get("id") as string;

    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
        ...(userRole === "teacher"
          ? { teacherId: userId! }
          : {}),
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

//assignment actions 

export const createAssignment = async (
  currentState: currentState,
  data: AssignmentSchema
) => {
  const userRole = await role();
  const userId = await currentUserId();

  try {
    if (userRole === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: currentState,
  data: AssignmentSchema
) => {
  const userRole = await role();
  const userId = await currentUserId();

  try {
    if (userRole === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: currentState,
  data: FormData
) => {
  const userRole = await role();
  const userId = await currentUserId();

  try {
    const id = data.get("id") as string;

    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
        ...(userRole === "teacher"
          ? {
              lesson: {
                teacherId: userId!,
              },
            }
          : {}),
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

//result actions
export const createResult = async (
  currentState: currentState,
  data: ResultSchema
) => {
  const userRole = await role();
  const userId = await currentUserId();

  try {
    if (userRole === "teacher") {
      const allowedExam = data.examId
        ? await prisma.exam.findFirst({
            where: {
              id: data.examId,
              lesson: { teacherId: userId! },
            },
          })
        : null;

      const allowedAssignment = data.assignmentId
        ? await prisma.assignment.findFirst({
            where: {
              id: data.assignmentId,
              lesson: { teacherId: userId! },
            },
          })
        : null;

      if (!allowedExam && !allowedAssignment) {
        return { success: false, error: true };
      }
    }

    await prisma.result.create({
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId || null,
        assignmentId: data.assignmentId || null,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateResult = async (
  currentState: currentState,
  data: ResultSchema
) => {
  const userRole = await role();
  const userId = await currentUserId();

  try {
    if (userRole === "teacher") {
      const allowedExam = data.examId
        ? await prisma.exam.findFirst({
            where: {
              id: data.examId,
              lesson: { teacherId: userId! },
            },
          })
        : null;

      const allowedAssignment = data.assignmentId
        ? await prisma.assignment.findFirst({
            where: {
              id: data.assignmentId,
              lesson: { teacherId: userId! },
            },
          })
        : null;

      if (!allowedExam && !allowedAssignment) {
        return { success: false, error: true };
      }
    }

    await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId || null,
        assignmentId: data.assignmentId || null ,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};


export const deleteResult = async (
  currentState: currentState,
  data: FormData
) => {
  const userRole = await role();
  const userId = await currentUserId();

  try {
    const id = parseInt(data.get("id") as string);

    if (userRole === "teacher") {
      const result = await prisma.result.findFirst({
        where: { id },
        include: {
          exam: { include: { lesson: true } },
          assignment: { include: { lesson: true } },
        },
      });

      if (!result) {
        return { success: false, error: true };
      }

      const isOwner =
        result.exam?.lesson?.teacherId === userId ||
        result.assignment?.lesson?.teacherId === userId;

      if (!isOwner) {
        return { success: false, error: true };
      }
    }

    await prisma.result.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

//event actions 
export const createEvent = async (
  currentState: currentState,
  data: EventSchema
) => {
  const userRole = await role();

  try {
    if (userRole !== "admin") {
      return { success: false, error: true };
    }

    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};


export const updateEvent = async (
  currentState: currentState,
  data: EventSchema
) => {
  const userRole = await role();

  try {
    if (userRole !== "admin") {
      return { success: false, error: true };
    }

    await prisma.event.update({
      where: {
        id: data.id!,
      },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: currentState,
  data: FormData
) => {
  const userRole = await role();

  try {
    if (userRole !== "admin") {
      return { success: false, error: true };
    }

    const id = data.get("id") as string;

    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};


export const createAnnouncement = async (
  currentState: currentState,
  data: AnnouncementSchema
) => {
  const userRole = await role();

  try {
    if (userRole !== "admin") {
      return { success: false, error: true };
    }

    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};


export const updateAnnouncement = async (
  currentState: currentState,
  data: AnnouncementSchema
) => {
  const userRole = await role();

  try {
    if (userRole !== "admin") {
      return { success: false, error: true };
    }

    await prisma.announcement.update({
      where: {
        id: data.id!,
      },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (
  currentState: currentState,
  data: FormData
) => {
  const userRole = await role();

  try {
    if (userRole !== "admin") {
      return { success: false, error: true };
    }

    const id = data.get("id") as string;

    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};