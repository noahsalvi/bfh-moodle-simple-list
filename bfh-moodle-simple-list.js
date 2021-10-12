("use strict");

// ==UserScript==
// @name         BFH - Simple Moodle List
// @author       https://github.com/noahsalvi
// @match        https://moodle.bfh.ch/*
// ==/UserScript==

(async () => {
  const STORAGE_KEY = "USER-SCRIPT-COURSE-FULLNAMES";
  const REQUEST_CONFIG = [
    {
      index: 0,
      methodname: "core_course_get_enrolled_courses_by_timeline_classification",
      args: {
        offset: 0,
        limit: 0,
        classification: "all",
        sort: "shortname",
        customfieldname: "semester",
        customfieldvalue: "",
      },
    },
  ];

  const mediaBodies = document.getElementsByClassName("media-body");
  const sessKey = document.head.textContent.match(/sesskey":"(.*?)"/)?.[1];
  const path = `https://moodle.bfh.ch/lib/ajax/service.php?sesskey=${sessKey}&info=core_course_get_enrolled_courses_by_timeline_classification`;

  let courses = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
  if (!courses) {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify(REQUEST_CONFIG),
    });
    if (!response.ok)
      return console.error("BFH - Simple Moodle List: Couldn't fetch courses");

    courses = (await response.json())[0].data.courses;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }

  for (let mediaBody of mediaBodies) {
    const fullName = courses.find(
      (course) => course.shortname === mediaBody.textContent
    )?.fullname;
    if (fullName) {
      // Interaction Design (BTI1101) 21/22 => Interaction Desgin
      const shortenedFullName = fullName.replace(/\(.*/, "");
      mediaBody.textContent = shortenedFullName;
    }
  }
})();
