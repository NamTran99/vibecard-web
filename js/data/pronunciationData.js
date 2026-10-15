(function(window) {
    'use strict';

    window.PRONUNCIATION_PRESETS = [
        {
            id: 'resilient',
            word: 'resilient',
            ipa: '/rɪˈzɪl.jənt/',
            pos: 'adjective • B2/C1',
            meaning: 'Kiên cường, có khả năng phục hồi nhanh chóng sau khó khăn, nghịch cảnh.',
            example: 'He remained remarkably resilient in the face of adversity.',
            scoreAzure: {
                overall: 84,
                accuracy: 86,
                fluency: 82,
                completeness: 100,
                prosody: 83,
                phonemes: [
                    { ph: '/r/', score: 94, status: 'good', desc: 'Âm /r/ cuộn lưỡi chuẩn xác' },
                    { ph: '/ɪ/', score: 88, status: 'good', desc: 'Nguyên âm ngắn /ɪ/ tự nhiên' },
                    { ph: '/z/', score: 62, status: 'warn', desc: 'Âm /z/ bị yếu, hơi hướng âm vô thanh /s/' },
                    { ph: '/ɪ/', score: 91, status: 'good', desc: 'Chuẩn xác' },
                    { ph: '/l/', score: 89, status: 'good', desc: 'Âm /l/ nâng đầu lưỡi tốt' },
                    { ph: '/j/', score: 85, status: 'good', desc: 'Bán nguyên âm /j/ nối mượt mà' },
                    { ph: '/ə/', score: 90, status: 'good', desc: 'Âm schwa /ə/ thả lỏng tự nhiên' },
                    { ph: '/n/', score: 92, status: 'good', desc: 'Âm mũi /n/ chuẩn xác' },
                    { ph: '/t/', score: 68, status: 'warn', desc: 'Âm chặn đuôi /t/ hơi nhỏ, cần bật dứt khoát' }
                ]
            },
            scoreSpeechAce: {
                overall: 82,
                cefr: 'B2 Upper-Intermediate',
                accuracy: 84,
                fluency: 80,
                completeness: 100,
                prosody: 81,
                soundMostLike: {
                    detected: 're-SI-li-en',
                    expected: 're-ZI-li-ent',
                    issues: [
                        'Âm xát hữu thanh /z/ bị biến âm thành /s/ (lỗi điển hình của người Việt)',
                        'Nuốt âm chặn cuối /t/ ở âm tiết cuối'
                    ]
                },
                coachTip: '💡 <b>Mẹo từ Lumi Fox</b>: Khi phát âm /z/, hãy đặt tay lên cổ họng để cảm nhận thanh quản rung rõ rệt. Đừng quên bật nhẹ âm chặn /t/ ở cuối từ để người bản xứ không nhầm lẫn!'
            }
        },
        {
            id: 'extraordinary',
            word: 'extraordinary',
            ipa: '/ɪkˈstrɔːr.dən.er.i/',
            pos: 'adjective • B2',
            meaning: 'Phi thường, xuất chúng, vượt ngoài những điều thông thường.',
            example: 'She has an extraordinary talent for acoustic music.',
            scoreAzure: {
                overall: 91,
                accuracy: 93,
                fluency: 88,
                completeness: 100,
                prosody: 90,
                phonemes: [
                    { ph: '/ɪk/', score: 92, status: 'good', desc: 'Bật hơi phụ âm chặn tốt' },
                    { ph: '/str/', score: 94, status: 'good', desc: 'Cụm 3 phụ âm /str/ phát âm liên hoàn xuất sắc' },
                    { ph: '/ɔːr/', score: 91, status: 'good', desc: 'Nguyên âm dài có uốn lưỡi chuẩn US' },
                    { ph: '/dən/', score: 89, status: 'good', desc: 'Âm schwa lướt nhẹ' },
                    { ph: '/er.i/', score: 93, status: 'good', desc: 'Nguyên âm kết thúc rất mượt mà' }
                ]
            },
            scoreSpeechAce: {
                overall: 90,
                cefr: 'C1 Advanced',
                accuracy: 92,
                fluency: 88,
                completeness: 100,
                prosody: 89,
                soundMostLike: {
                    detected: 'ik-stror-də-ner-i',
                    expected: 'ik-stror-də-ner-i',
                    issues: ['Cụm phụ âm /kstr/ được xử lý rất mượt, đạt chuẩn học thuật.']
                },
                coachTip: '🌟 <b>Tuyệt hảo</b>: Bạn xử lý cụm phụ âm khó /kstr/ rất tự nhiên! Trọng âm rơi chuẩn xác vào âm tiết thứ hai.'
            }
        },
        {
            id: 'vulnerability',
            word: 'vulnerability',
            ipa: '/ˌvʌl.nɚ.əˈbɪl.ə.t̬i/',
            pos: 'noun • C1',
            meaning: 'Tính dễ bị tổn thương, điểm yếu cần được thấu hiểu và bảo vệ.',
            example: 'Vulnerability is not weakness; it is our greatest measure of courage.',
            scoreAzure: {
                overall: 76,
                accuracy: 78,
                fluency: 74,
                completeness: 100,
                prosody: 75,
                phonemes: [
                    { ph: '/v/', score: 85, status: 'good', desc: 'Răng trên chạm môi dưới tốt' },
                    { ph: '/ʌl/', score: 65, status: 'warn', desc: 'Dark L /l/ ở âm tiết đầu bị nuốt âm' },
                    { ph: '/nɚ/', score: 72, status: 'warn', desc: 'Âm r-colored chưa đủ độ uốn lưỡi' },
                    { ph: '/ə/', score: 90, status: 'good', desc: 'Chuẩn xác' },
                    { ph: '/bɪl/', score: 88, status: 'good', desc: 'Chuẩn xác' },
                    { ph: '/t̬i/', score: 58, status: 'bad', desc: 'Flap T /t̬/ bị phát âm cứng thành âm /t/ giật' }
                ]
            },
            scoreSpeechAce: {
                overall: 75,
                cefr: 'B1+ Intermediate',
                accuracy: 77,
                fluency: 73,
                completeness: 100,
                prosody: 74,
                soundMostLike: {
                    detected: 'vun-nơ-rơ-bi-li-ti',
                    expected: 'vʌl-nɚ-ə-bɪl-ə-t̬i',
                    issues: [
                        'Âm Dark L (/l/ sau nguyên âm) chưa rõ',
                        'Âm Flap T giữa 2 nguyên âm bị phát âm cứng như tiếng Việt'
                    ]
                },
                coachTip: '💡 <b>Mẹo giọng Mỹ</b>: Trong từ này, chữ /t/ đứng giữa hai nguyên âm nên được đọc lướt mềm như âm "đ" nhẹ trong tiếng Việt (Flap T), tránh giật mạnh kiểu British /t/.'
            }
        },
        {
            id: 'phenomenon',
            word: 'phenomenon',
            ipa: '/fəˈnɑː.mə.nɑːn/',
            pos: 'noun • B2/C1',
            meaning: 'Hiện tượng kỳ thú, sự việc kỳ lạ có thể quan sát trong tự nhiên.',
            example: 'The northern lights are a truly spectacular natural phenomenon.',
            scoreAzure: {
                overall: 93,
                accuracy: 95,
                fluency: 91,
                completeness: 100,
                prosody: 92,
                phonemes: [
                    { ph: '/fə/', score: 95, status: 'good', desc: 'Âm xát răng môi /f/ rất chuẩn' },
                    { ph: '/ˈnɑː/', score: 97, status: 'good', desc: 'Nguyên âm mở rộng chuẩn US, nhấn trọng âm tuyệt vời' },
                    { ph: '/mə/', score: 91, status: 'good', desc: 'Schwa nhẹ nhàng' },
                    { ph: '/nɑːn/', score: 94, status: 'good', desc: 'Âm mũi chuẩn xác' }
                ]
            },
            scoreSpeechAce: {
                overall: 94,
                cefr: 'C2 Mastery',
                accuracy: 96,
                fluency: 92,
                completeness: 100,
                prosody: 93,
                soundMostLike: {
                    detected: 'fə-NAH-mə-nahn',
                    expected: 'fə-NAH-mə-nahn',
                    issues: ['Phát âm xuất sắc, không phát hiện lỗi biến âm người Việt.']
                },
                coachTip: '🔥 <b>Chuẩn bản xứ C2</b>: Nhấn trọng âm rơi đúng vào âm tiết thứ 2 "NOM", các âm schwa xung quanh lướt rất tự nhiên!'
            }
        },
        {
            id: 'serendipity',
            word: 'serendipity',
            ipa: '/ˌser.ənˈdɪp.ə.t̬i/',
            pos: 'noun • C1',
            meaning: 'Khả năng tình cờ tìm thấy những điều tốt đẹp, may mắn một cách kỳ diệu.',
            example: 'Finding this cozy cafe was pure serendipity on a rainy day.',
            scoreAzure: {
                overall: 87,
                accuracy: 89,
                fluency: 85,
                completeness: 100,
                prosody: 86,
                phonemes: [
                    { ph: '/ser/', score: 92, status: 'good', desc: 'Âm /s/ và /er/ chuẩn' },
                    { ph: '/ən/', score: 89, status: 'good', desc: 'Chuẩn xác' },
                    { ph: '/ˈdɪp/', score: 91, status: 'good', desc: 'Trọng âm chính bật dứt khoát' },
                    { ph: '/ə/', score: 88, status: 'good', desc: 'Chuẩn xác' },
                    { ph: '/t̬i/', score: 75, status: 'warn', desc: 'Flap T hơi cứng, thả lỏng đầu lưỡi hơn' }
                ]
            },
            scoreSpeechAce: {
                overall: 86,
                cefr: 'B2+ Upper-Intermediate',
                accuracy: 88,
                fluency: 84,
                completeness: 100,
                prosody: 85,
                soundMostLike: {
                    detected: 'se-rơn-DI-pi-ti',
                    expected: 'se-rən-DIP-ə-ti',
                    issues: ['Nhịp điệu từ mượt mà, cần thả lỏng âm Flap T.']
                },
                coachTip: '✨ <b>Tình cờ thú vị</b>: Từ vựng rất giàu chất thơ. Trọng âm chính ở âm tiết thứ 3 "DIP" đã được bạn nhấn rất rõ ràng!'
            }
        },
        {
            id: 'sentence_practice',
            word: 'Luyện Câu Dài (IELTS 8.0)',
            ipa: '/ʃiː rɪˈmeɪnd rɪˈmɑːr.kə.bli rɪˈzɪl.jənt dɪˈspaɪt.../',
            pos: 'IELTS Band 7.5+ • Câu phức',
            text: 'She remained remarkably resilient despite the unexpected obstacles.',
            meaning: 'Cô ấy vẫn kiên cường một cách đáng kinh ngạc bất chấp những trở ngại bất ngờ.',
            example: 'Focus on linking sounds, rhythm, and natural chunking pauses.',
            scoreAzure: {
                overall: 86,
                accuracy: 88,
                fluency: 83,
                completeness: 100,
                prosody: 87,
                phonemes: [
                    { ph: 'She', score: 94, status: 'good', desc: 'Âm /ʃ/ tròn môi chuẩn' },
                    { ph: 'remained', score: 89, status: 'good', desc: 'Nối âm /nd/ mượt' },
                    { ph: 'remarkably', score: 86, status: 'good', desc: 'Trọng âm tốt' },
                    { ph: 'resilient', score: 82, status: 'good', desc: 'Âm /z/ rõ ràng' },
                    { ph: 'despite', score: 88, status: 'good', desc: 'Nguyên âm đôi /aɪ/ chuẩn' },
                    { ph: 'unexpected', score: 84, status: 'good', desc: 'Nguyên âm ngắn /ɪd/ chuẩn' },
                    { ph: 'obstacles', score: 78, status: 'warn', desc: 'Cụm phụ âm cuối /klz/ hơi vấp' }
                ]
            },
            scoreSpeechAce: {
                overall: 85,
                cefr: 'C1 Advanced',
                accuracy: 87,
                fluency: 82,
                completeness: 100,
                prosody: 86,
                soundMostLike: {
                    detected: 'She re-mained re-mar-kab-ly re-si-li-ent...',
                    expected: 'Full native connected speech',
                    issues: ['Ngắt nghỉ tự nhiên, nhịp điệu ngữ điệu (prosody) mang tính nhạc điệu cao.']
                },
                coachTip: '🎙️ <b>Đánh giá câu dài</b>: Bạn ngắt nhịp (chunking) rất chuẩn giữa mệnh đề chính và cụm "despite the unexpected obstacles". Rất gần với phong thái IELTS Speaking 8.0!'
            }
        }
    ];

})(window);
