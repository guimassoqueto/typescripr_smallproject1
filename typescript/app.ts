/// <reference path="./components/ProjectInput.class.ts" />
/// <reference path="./components/ProjectList.class.ts" />

namespace App {
    new ProjectInput();
    new ProjectList('active');
    new ProjectList('finished');
}