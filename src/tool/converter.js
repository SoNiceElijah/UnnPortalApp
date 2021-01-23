
export const LEC_TYPES = [
    262, // Лекция
    264, // 
    263, //
    271, // Консультация
    266, // Экзамен
];

export const EMOJI = {
    t262 : '&#128215;',
    t264 : "&#128217;",
    t263 : "&#128216;",
    t271 : "&#128214;",
    t266 : "&#128213;",
    undef : "&#128211;"
}

export const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "NOV",
    "DEC"
];


export const DAYS = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
];

export function convert(e) {

    // Taken from UnnPortalBot

    let teachersign = e.lecturer.trim().split(' ');
    let tsign = teachersign[0];
    if(teachersign[1]) tsign += ' ' + teachersign[1][0];
    if(teachersign[2]) tsign += '.' + teachersign[2][0] + '.';

    let d = e.date.split('.');
    let obj = {
        id : e.disciplineOid,
        from : e.beginLesson,
        to : e.endLesson,
        num : e.lessonNumberStart,
        type : LEC_TYPES.indexOf(e.kindOfWorkOid),
        typename : e.kindOfWork,
        name : e.discipline,
        rootname : e.discipline.match(/[^\)]+(\(|$)/gu).join('').replace(/\(/gu,''),
        teacher : e.lecturer,
        tsign : tsign,
        emoji : EMOJI['t' + e.kindOfWorkOid] ? EMOJI['t' + e.kindOfWorkOid] : EMOJI['undef'],
        place : e.auditorium,
        building : e.building,
        sub : e.subGroup,
        date : e.date,
        day : e.dayOfWeekString,
        dnum : e.dayOfWeek,
        short : e.discipline
            .match(/[^\)]+(\(|$)/gu).join('').replace(/\(/gu,'')
            .match(/(?<=[\s,.:;"']|^)([а-яА-Я]|[a-zA-Z])/gu).join('')
            .toUpperCase(),
        readabledate : d[2].replace(/^0+/g,'') + ' ' + MONTHS[parseInt(d[1], 10) - 1] + ' ' + d[0] 
    };

    return obj;
} 

export function dateToString(date) {
    console.log(date);
    return date.getFullYear().toString(10).padStart(4,'0') + '.'
            + (date.getMonth()+1).toString(10).padStart(2,'0') + '.'
            + date.getDate().toString(10).padStart(2,'0');
}