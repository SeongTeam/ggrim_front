'use server';

import { randomInt } from 'crypto';
import { Quiz } from '../../model/interface/quiz';
import { findQuiz } from '../../server-action/api.backend';
import { QuizContext, SingletonQuizContextScheduler } from './api.quiz.scheduler';
import { FindQuizResult } from '../../server-action/dto';
import { serverLogger } from '../../util/logger';
import { Painting } from '../../model/interface/painting';

export interface QuizStatus {
    context: QuizContext;
    currentIdx: number;
    endIdx: number;
}

export interface ResponseQuizDTO {
    quiz: Quiz;
    status: QuizStatus;
}

// TODO: Quiz Loading 성능 향상
// - [ ] 프론트 또는 백엔드에 cache 로직 적용하기.
//  -> quizContextScheduler 모듈에 기능을 추가하거나, nextjs cache 기능을 활용한다.
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: 인덱스 방식은 DB에서 반환된 Quiz[]가 변형되면, 이전 응답 결과와 동일한 결과를 제공할 수 있지 않은가?
// * 참고: <관련 정보나 링크>

export async function getQuizIDByContext(status?: QuizStatus): Promise<ResponseQuizDTO> {
    const INIT_IDX = -1;
    if (!status || (status && status.currentIdx == status.endIdx)) {
        const context = await SingletonQuizContextScheduler.scheduleContext();
        status = {
            context,
            currentIdx: INIT_IDX,
            endIdx: INIT_IDX,
        };
    }

    try {
        const { artist, tag, style, page } = status.context;

        const result: FindQuizResult = await findQuiz(
            artist ? [artist] : undefined,
            tag ? [tag] : undefined,
            style ? [style] : undefined,
            page,
        );
        const quizList: Quiz[] = result.data;

        status.endIdx = quizList.length - 1;

        if (status.currentIdx === INIT_IDX) {
            status.currentIdx = randomInt(quizList.length);
        } else {
            status.currentIdx = (status.currentIdx + 1) % quizList.length;
        }

        return {
            quiz: quizList[status.currentIdx],
            status,
        };
    } catch (e: unknown) {
        serverLogger.error(`fail getQuizIDByContext(). ${JSON.stringify(e)}`);

        throw e;
    }
}

export async function addQuizContextByPainting(painting: Painting): Promise<boolean> {
    const artistName: string = painting.artist.name;
    const context: QuizContext = {
        artist: artistName,
        page: 0,
    };

    return SingletonQuizContextScheduler.requestAddContext([context]);
}

export async function updateFixedContexts(quizContexts: QuizContext[]): Promise<boolean> {
    return SingletonQuizContextScheduler.requestUpdateFixedQuiz(quizContexts);
}
