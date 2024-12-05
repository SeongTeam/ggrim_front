'use client';

// frontend to show the previous submissions for a given MCQ block

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Submission = {
    id: number;
    selected_answer: string;
    is_correct: boolean;
    submitted_at: string;
};

const mockSubmissions: Submission[] = [
    {
        id: 1,
        selected_answer: 'A',
        is_correct: true,
        submitted_at: '2024-11-13T09:00:00Z',
    },
    {
        id: 2,
        selected_answer: 'B',
        is_correct: false,
        submitted_at: '2024-11-13T09:05:00Z',
    },
    {
        id: 3,
        selected_answer: 'C',
        is_correct: true,
        submitted_at: '2024-11-13T09:10:00Z',
    },
    {
        id: 4,
        selected_answer: 'D',
        is_correct: false,
        submitted_at: '2024-11-13T09:15:00Z',
    },
    {
        id: 5,
        selected_answer: 'A',
        is_correct: true,
        submitted_at: '2024-11-13T09:20:00Z',
    },
];

interface SubmissionPaneProps {
    mcqId: string;
    show: boolean;
    onClose: () => void;
    question: string;
}

const SubmissionPane: React.FC<SubmissionPaneProps> = ({
    // mcqId,
    show,
    // onClose,
    question,
}) => {
    // const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
    // const [isVisible, setIsVisible] = useState(false);
    // const [loading, setLoading] = useState<boolean>(false);

    // useEffect(() => {
    //   if (!show) return;

    //   let isMounted = true;
    //   setIsVisible(true);
    //   setLoading(true); // Start loading

    //   fetch(`/api/mcq/${mcqId}`)
    //     .then((res) => {
    //       if (!res.ok) {
    //         throw new Error("Failed to fetch submissions");
    //       }
    //       return res.json();
    //     })
    //     .then((data) => {
    //       if (isMounted && data && Array.isArray(data.submissions)) {
    //         setSubmissions(data.submissions);
    //       } else {
    //         console.error("Unexpected response format:", data);
    //       }
    //       setLoading(false); // Loading complete
    //     })
    //     .catch((error) => {
    //       if (isMounted) {
    //         console.error("Error fetching submissions:", error);
    //         setLoading(false); // Loading complete even on error
    //       }
    //     });

    //   return () => {
    //     isMounted = false;
    //   };
    // }, [mcqId, show]);

    // const handleClose = () => {
    //   setIsVisible(false);
    //   onClose();
    // };

    // if (!show) return null;

    return (
        <div
            className={`fixed top-16 right-3 w-1/4 h-auto max-h-[50vh] border-dashed border-neutral border-2 shadow-lg z-50 p-4 rounded-md flex flex-col transition-opacity duration-300 ease-in-out bg-red-400 ${
                true ? 'opacity-100' : 'opacity-0'
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-pane-title"
        >
            <div className="flex justify-between items-start">
                <h2 id="submission-pane-title" className="text-lg font-bold">
                    Submission History
                </h2>
                <button
                    // onClick={handleClose}
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="Close Submission Pane"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-5">{question}</h3>
            <div className="overflow-y-auto flex-grow">
                {false ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-6 w-full bg-gray-300 rounded mb-2"></div>
                        <div className="h-6 w-full bg-gray-300 rounded mb-2"></div>
                        <div className="h-6 w-full bg-gray-300 rounded mb-2"></div>
                    </div>
                ) : false ? (
                    <p className="text-center text-gray-500">No submissions available.</p>
                ) : (
                    // <table className="table w-full table-xs">
                    //   <thead className="sticky top-0 bg-base-100 shadow-sm z-10">
                    //     <tr>
                    //       <th>#</th>
                    //       <th>Selected Answer</th>
                    //       <th>Correct</th>
                    //       <th>Submitted At</th>
                    //     </tr>
                    //   </thead>
                    //   <tbody>
                    //     {submissions.map((submission, index) => (
                    //       <tr key={submission.id} className="hover:bg-base-200">
                    //         <th>{index + 1}</th>
                    //         <td>
                    //           {submission.selected_answer.length > 20
                    //             ? submission.selected_answer.slice(0, 17) + "..."
                    //             : submission.selected_answer}
                    //         </td>
                    //         <td
                    //           className={
                    //             submission.is_correct ? "text-success" : "text-error"
                    //           }
                    //         >
                    //           {submission.is_correct ? "Yes" : "No"}
                    //         </td>
                    //         <td>{new Date(submission.submitted_at).toLocaleString()}</td>
                    //       </tr>
                    //     ))}
                    //   </tbody>
                    // </table>
                    <table className="table w-full table-xs">
                        <thead className="sticky top-0 bg-base-100 shadow-sm z-10">
                            <tr>
                                <th>#</th>
                                <th>Selected Answer</th>
                                <th>Correct</th>
                                <th>Submitted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={'a1'} className="hover:bg-blue-400">
                                <th>{2}</th>
                                <td>교통비</td>
                                <td>45000</td>
                                <td>{new Date().toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>식비</td>
                                <td>18000</td>
                            </tr>
                            <tr>
                                <td>숙박비</td>
                                <td>40000</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>총 합계</td>
                                <td>103000</td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SubmissionPane;
