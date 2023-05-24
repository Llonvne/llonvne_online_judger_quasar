export class Language {
  constructor(
    public id: number,
    public languageName: string,
    public languageVersion: string
  ) {}
}

export class CompileResult {
  constructor(public submission_id: string, public is_ok: boolean) {}
}

export class RunnerResult {
  constructor(
    public submission_id: number,
    public status: string,
    public result: { expect: string; stdout: string; stderr: string }[]
  ) {}
}

export class Problem {
  constructor(
    public problemId: number,
    public problemName: string,
    public context: string,
    public timeLimit: number,
    public memoryLimit: number,
    public source: string,
    public author: string,
    public solved: number,
    public tags: string[]
  ) {}
}

export class User {
  constructor(
    public username: string | null,
    public nickname: string | null,
    public realname: string | null,
    public gender: string | null
  ) {}
}

export class Links {
  constructor(
    public self: { href: string },
    public submission: { href: string; templated: boolean },
    public language: { href: string },
    public problem: { href: string; templated: boolean },
    public user: { href: string; templated: boolean }
  ) {}
}

export class Submission {
  constructor(
    public id: number,
    public language: Language,
    public compileResult: CompileResult,
    public runnerResult: RunnerResult,
    public submittedTime: string,
    public ojResult: string,
    public args: object,
    public code: string,
    public judger: string,
    public rawCode: string,
    public problem: Problem,
    public user: User,
    public _links: Links
  ) {}
}
