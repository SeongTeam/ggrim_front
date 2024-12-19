// 'use client';

// // frontend to show the previous submissions for a given MCQ block

// import React from 'react';
// import { X } from 'lucide-react';

// // type Submission = {
// //     id: number;
// //     selected_answer: string;
// //     is_correct: boolean;
// //     submitted_at: string;
// // };

// interface SubmissionPaneProps {
//     mcqId: string;
//     show: boolean;
//     onClose: () => void;
//     question: string;
// }

// const SubmissionPane: React.FC<SubmissionPaneProps> = ({
//     // mcqId,
//     // show,
//     // onClose,
//     question,
// }) => {
//     return (
//         <div
//             className={`fixed top-16 right-3 w-1/4 h-auto max-h-[50vh] border-dashed border-neutral border-2 shadow-lg z-50 p-4 rounded-md flex flex-col transition-opacity duration-300 ease-in-out bg-red-400 ${
//                 true ? 'opacity-100' : 'opacity-0'
//             }`}
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="submission-pane-title"
//         >
//             <div className="flex justify-between items-start">
//                 <h2 id="submission-pane-title" className="text-lg font-bold">
//                     Submission History
//                 </h2>
//                 <button
//                     // onClick={handleClose}
//                     className="text-gray-600 hover:text-gray-800"
//                     aria-label="Close Submission Pane"
//                 >
//                     <X className="w-6 h-6" />
//                 </button>
//             </div>
//             <h3 className="text-sm font-semibold text-gray-600 mb-5">{question}</h3>
//             <div className="overflow-y-auto flex-grow">
//                 {false ? (
//                     <div className="space-y-2 animate-pulse">
//                         <div className="h-6 w-full bg-gray-300 rounded mb-2"></div>
//                         <div className="h-6 w-full bg-gray-300 rounded mb-2"></div>
//                         <div className="h-6 w-full bg-gray-300 rounded mb-2"></div>
//                     </div>
//                 ) : false ? (
//                     <p className="text-center text-gray-500">No submissions available.</p>
//                 ) : (
//                     <table className="table w-full table-xs">
//                         <thead className="sticky top-0 bg-base-100 shadow-sm z-10">
//                             <tr>
//                                 <th>#</th>
//                                 <th>Selected Answer</th>
//                                 <th>Correct</th>
//                                 <th>Submitted At</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr key={'a1'} className="hover:bg-blue-400">
//                                 <th>{2}</th>
//                                 <td>교통비</td>
//                                 <td>45000</td>
//                                 <td>{new Date().toLocaleString()}</td>
//                             </tr>
//                             <tr>
//                                 <td>식비</td>
//                                 <td>18000</td>
//                             </tr>
//                             <tr>
//                                 <td>숙박비</td>
//                                 <td>40000</td>
//                             </tr>
//                         </tbody>
//                         <tfoot>
//                             <tr>
//                                 <td>총 합계</td>
//                                 <td>103000</td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SubmissionPane;
