// ========================================================
// 🎭 ROADMAP ANIMATED CHARACTERS PART A (1 TO 5 — 3-ACT)
// Ceiling: < 350 lines | Studio 3/4 Isometric Vector Art
// ========================================================

window.ROADMAP_ANIMATED_CHARACTERS_A = [
    {
        id: 'bea_campfire',
        num: 1,
        themeGenre: 'fable',
        name: 'Bea · Lửa Trại Rừng Ngụ Ngôn',
        badge: 'Khu Rừng Ngụ Ngôn',
        badgeStyle: 'background:rgba(243,155,27,0.22);color:#FBBF24;',
        quote: 'Kẹo dẻo nướng lửa trại thơm lừng! Cùng mình thắp sáng Khu Rừng Ngụ Ngôn nhé!',
        svg: `<svg viewBox="0 0 320 320" class="rm-char-svg w-full h-full">
            <defs><linearGradient id="rmFireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#E65C00" /><stop offset="60%" stop-color="#F39B1B" /><stop offset="100%" stop-color="#FFD54F" />
            </linearGradient></defs>
            <ellipse cx="115" cy="242" rx="56" ry="30" class="rm-char-floor-shadow" fill="#DCDAD7" /> <ellipse cx="235" cy="268" rx="48" ry="26" class="rm-char-floor-shadow" fill="#DCDAD7" />
            <ellipse cx="235" cy="265" rx="42" ry="22" fill="#F5A623" opacity="0.28" /> <path d="M 78 192 Q 75 215, 62 226 Q 56 232, 68 238 L 92 242 Q 105 256, 116 262 Q 125 265, 134 252 L 168 245 Q 178 242, 172 230 Q 162 215, 158 192 Z" fill="#B56513" />
            <path d="M 90 195 Q 88 222, 76 235 L 108 255 Q 118 258, 122 235 L 122 195 Z" fill="#9A510B" /> <ellipse cx="118" cy="192" rx="40" ry="18" fill="#E6AE65" />
            <ellipse cx="118" cy="192" rx="29" ry="12" fill="none" stroke="#C9883B" stroke-width="2.5" />
            <g style="transform-origin: 125px 180px; animation: beaPanicBody 5.0s ease-in-out infinite;">
                <path d="M 126 226 Q 126 246, 140 246 Q 151 246, 151 232 L 146 218 Z" fill="#EB4B59" /> <path d="M 127 240 Q 138 245, 150 238" fill="none" stroke="#C83240" stroke-width="3.5" stroke-linecap="round" />
                <g style="transform-origin: 156px 228px; animation: footTap 1.6s ease-in-out infinite;">
                    <path d="M 148 218 Q 152 238, 166 236 Q 176 234, 173 220 L 164 208 Z" fill="#D93B49" />
                </g>
                <path d="M 102 176 Q 94 208, 118 228 Q 135 238, 152 228 L 168 216 Q 176 196, 156 176 Z" fill="#1FA1EC" /> <path d="M 138 184 Q 152 200, 152 224" fill="none" stroke="#1480C2" stroke-width="4.5" stroke-linecap="round" />
                <path d="M 118 224 Q 135 234, 152 224" fill="none" stroke="#47B8F8" stroke-width="7" stroke-linecap="round" /> <path d="M 152 216 Q 163 222, 172 212" fill="none" stroke="#47B8F8" stroke-width="7" stroke-linecap="round" />
                <path d="M 103 174 Q 128 183, 148 171" fill="none" stroke="#EB5347" stroke-width="6.5" stroke-linecap="round" /> <path d="M 100 146 Q 98 172, 105 176 Q 130 181, 146 170 Q 150 155, 140 142 Z" fill="var(--rm-char-primary, #F0B138)" />
                <path d="M 106 144 Q 124 162, 144 146 L 138 158 Q 124 168, 104 156 Z" fill="var(--rm-char-accent, #10B981)" /> <path d="M 100 152 Q 87 176, 82 200" fill="none" stroke="#8C583A" stroke-width="19" stroke-linecap="round" />
                <circle cx="82" cy="203" r="10.5" fill="#8C583A" />
                <g style="transform-origin: 138px 156px; animation: beaStoryUpperArm 5.0s ease-in-out infinite;">
                    <path d="M 134 154 Q 156 160, 172 168" fill="none" stroke="#7A4B30" stroke-width="18" stroke-linecap="round" /> <path d="M 134 152 Q 156 158, 172 166" fill="none" stroke="#8C583A" stroke-width="15" stroke-linecap="round" />
                    <g style="transform-origin: 172px 166px; animation: beaStoryForearm 5.0s ease-in-out infinite;">
                        <path d="M 158 175 Q 185 168, 205 165 Q 225 165, 252 152" fill="none" stroke="#A85E12" stroke-width="5.5" stroke-linecap="round" /> <path d="M 185 168 L 198 177" fill="none" stroke="#A85E12" stroke-width="4.5" stroke-linecap="round" />
                        <circle cx="174" cy="166" r="10" fill="#8C583A" /> <ellipse cx="177" cy="161" rx="6" ry="4" fill="#9E6646" />
                        <g transform="rotate(-15 234 152)">
                            <rect x="220" y="141" width="25" height="21" rx="7" fill="#F4EFEA" /> <ellipse cx="223" cy="151.5" rx="4.5" ry="10" fill="#E2DBD4" />
                            <ellipse cx="238" cy="151.5" rx="6" ry="7" fill="#EBB87B" opacity="0.55" /> <rect x="220" y="141" width="25" height="21" rx="7" fill="#272422" style="animation: beaCandyChar 5.0s ease-in-out infinite;" />
                            <g style="transform-origin: 234px 145px; animation: beaCandyFire 5.0s ease-in-out infinite;">
                                <path d="M 215 147 Q 208 112, 234 90 Q 242 104, 248 96 Q 258 116, 252 147 Z" fill="#FF3B00" /> <path d="M 221 146 Q 217 120, 234 103 Q 249 120, 245 146 Z" fill="#FF9500" />
                                <path d="M 226 146 Q 225 128, 234 116 Q 243 128, 241 146 Z" fill="#FFF066" />
                            </g>
                            <g style="transform-origin: 238px 132px; animation: beaFireSparks 5.0s ease-out infinite;">
                                <circle cx="242" cy="128" r="3" fill="#FF5722" /><circle cx="250" cy="120" r="2.4" fill="#FFD600" /> <path d="M 238 125 L 252 118" stroke="#FFF176" stroke-width="2" stroke-linecap="round" />
                            </g>
                            <g style="transform-origin: 234px 135px; animation: beaSmokeAfter 5.0s ease-out infinite;">
                                <circle cx="232" cy="132" r="7.5" fill="#9CA3AF" opacity="0.82" /> <circle cx="243" cy="121" r="10" fill="#D1D5DB" opacity="0.72" />
                            </g>
                        </g>
                    </g>
                </g>
                <g style="transform-origin: 122px 132px; animation: beaStoryHead 5.0s ease-in-out infinite;">
                    <path d="M 76 108 Q 71 154, 116 158 Q 166 161, 171 128 Q 174 96, 135 88 Q 84 84, 76 108 Z" fill="#8C583A" /> <path d="M 71 112 Q 70 128, 78 136 L 86 116 Z" fill="#3B3A39" />
                    <g style="animation: beaEyesNormal 5.0s infinite;">
                        <g style="transform-origin: 148px 120px; animation: blink 4.8s infinite;">
                            <path d="M 123 120 Q 123 136, 136 136 Q 145 136, 145 120 Z" fill="#FFFFFF" /> <path d="M 149 115 Q 149 130, 160 130 Q 167 130, 167 115 Z" fill="#FFFFFF" />
                            <ellipse cx="138" cy="126" rx="5.5" ry="7" fill="#3B3A39" /><ellipse cx="159" cy="121" rx="5" ry="6.5" fill="#3B3A39" /> <circle cx="136" cy="123" r="1.8" fill="#FFFFFF" /><circle cx="157" cy="118" r="1.6" fill="#FFFFFF" />
                            <path d="M 121 120 Q 133 115, 146 120" fill="none" stroke="#6E4025" stroke-width="5.5" stroke-linecap="round" /> <path d="M 147 115 Q 158 110, 168 115" fill="none" stroke="#6E4025" stroke-width="5.5" stroke-linecap="round" />
                        </g>
                        <path d="M 124 106 Q 134 102, 141 106" fill="none" stroke="#5A331C" stroke-width="3" stroke-linecap="round" /> <path d="M 150 102 Q 158 98, 164 103" fill="none" stroke="#5A331C" stroke-width="3" stroke-linecap="round" />
                    </g>
                    <g style="transform-origin: 146px 122px; animation: beaEyesPanic 5.0s infinite;">
                        <ellipse cx="134" cy="124" rx="11.5" ry="12.5" fill="#FFFFFF" stroke="#5A331C" stroke-width="2" /> <ellipse cx="158" cy="119" rx="10" ry="11" fill="#FFFFFF" stroke="#5A331C" stroke-width="2" />
                        <circle cx="137" cy="125" r="3.2" fill="#1F1712" /><circle cx="160" cy="120" r="2.9" fill="#1F1712" /> <path d="M 120 104 Q 132 95, 143 102" fill="none" stroke="#3B1A0E" stroke-width="3.8" stroke-linecap="round" />
                        <path d="M 148 99 Q 159 91, 167 99" fill="none" stroke="#3B1A0E" stroke-width="3.8" stroke-linecap="round" />
                    </g>
                    <g style="transform-origin: 108px 110px; animation: beaPanicSweat 5.0s ease-out infinite;">
                        <path d="M 104 104 Q 96 112, 101 117 Q 106 120, 108 113 Z" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.2" />
                    </g>
                    <ellipse cx="147" cy="132" rx="5" ry="6.5" fill="#63361E" />
                    <g style="animation: beaMouthNormal 5.0s infinite;">
                        <path d="M 138 144 Q 143 147, 148 142" fill="none" stroke="#5A2818" stroke-width="3" stroke-linecap="round" /> <circle cx="140" cy="144" r="2.2" fill="#D94B43" />
                    </g>
                    <g style="transform-origin: 144px 145px; animation: beaMouthShock 5.0s infinite;">
                        <ellipse cx="144" cy="145" rx="7.5" ry="9.5" fill="#4A1212" stroke="#3B1A0E" stroke-width="2.2" /> <ellipse cx="144" cy="150" rx="4.5" ry="3.2" fill="#EF4444" />
                    </g>
                    <g style="transform-origin: 175px 62px; animation: alertPop 5.0s ease-in-out infinite;">
                        <rect x="171" y="36" width="7.5" height="19" rx="3.75" fill="#EF4444" stroke="#FFFFFF" stroke-width="1.8" /> <circle cx="174.75" cy="62" r="4.2" fill="#EF4444" stroke="#FFFFFF" stroke-width="1.8" />
                    </g>
                    <g style="animation: beaMouthBlow 5.0s infinite;">
                        <g style="transform-origin: 134px 141px; animation: beaCheekPuff 5.0s ease-in-out infinite;">
                            <circle cx="131" cy="141" r="11" fill="#9E6646" stroke="#6E4025" stroke-width="2" /> <ellipse cx="128" cy="138" rx="5" ry="3.5" fill="#E57373" opacity="0.45" />
                        </g>
                        <ellipse cx="154" cy="142" rx="6" ry="5" fill="#7A4B30" stroke="#4E2A14" stroke-width="2" /> <circle cx="157" cy="142" r="2.6" fill="#3B1A0E" />
                    </g>
                    <g style="transform-origin: 158px 142px; animation: beaWindPuffs 5.0s ease-out infinite;">
                        <ellipse cx="170" cy="140" rx="10" ry="6" fill="#E0F2FE" opacity="0.65" /> <circle cx="182" cy="136" r="7.5" fill="#FFFFFF" opacity="0.75" />
                    </g>
                    <g style="transform-origin: 158px 142px; animation: beaWindStream1 5.0s ease-out infinite;">
                        <path d="M 158 140 Q 186 135, 216 128 C 228 125, 232 115, 223 114 C 216 113, 215 122, 224 124" fill="none" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round" stroke-dasharray="48 14" /> <path d="M 160 142 Q 194 139, 232 135" fill="none" stroke="#7DD3FC" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="40 12" />
                    </g>
                    <g style="transform-origin: 158px 142px; animation: beaWindStream2 5.0s ease-out infinite;">
                        <path d="M 162 143 Q 202 141, 244 137" fill="none" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="44 12" />
                    </g>
                    <circle cx="81" cy="130" r="12" fill="#8C583A" /> <path d="M 70 96 Q 105 113, 142 90 Q 163 85, 172 96 L 170 110 Q 150 100, 130 110 Q 104 125, 86 125 L 71 113 Z" fill="var(--rm-char-primary, #F0B138)" />
                    <ellipse cx="136" cy="86" rx="8.5" ry="4.5" transform="rotate(25 136 86)" fill="#F7C143" /> <ellipse cx="150" cy="84" rx="8.5" ry="4.5" transform="rotate(-25 150 84)" fill="#F7C143" />
                    <circle cx="84" cy="74" r="28" fill="#4E3B30" stroke="#685042" stroke-width="1.5" /> <circle cx="115" cy="58" r="32" fill="#4E3B30" stroke="#685042" stroke-width="1.5" />
                    <circle cx="148" cy="66" r="28" fill="#4E3B30" stroke="#685042" stroke-width="1.5" /> <circle cx="162" cy="82" r="20" fill="#4E3B30" stroke="#685042" stroke-width="1.5" />
                    <circle cx="118" cy="82" r="26" fill="#4E3B39" />
                </g>
            </g>
            <g transform="rotate(-28 212 260)"><rect x="188" y="250" width="46" height="18" rx="8" fill="#A6580F" /></g>
            <g transform="rotate(28 258 260)"><rect x="235" y="250" width="46" height="18" rx="8" fill="#A6580F" /></g>
            <rect x="224" y="248" width="22" height="36" rx="10" fill="#B86516" /> <ellipse cx="235" cy="278" rx="11" ry="8" fill="#F0BE78" />
            <g style="transform-origin: 235px 252px; animation: flameOuter 1.15s ease-in-out infinite;">
                <path d="M 204 238 Q 200 205, 230 176 Q 236 170, 240 184 Q 243 194, 250 186 Q 256 182, 260 195 Q 270 224, 262 244 Q 250 260, 234 260 Q 212 260, 204 238 Z" fill="url(#rmFireGrad)" />
            </g>
            <g style="transform-origin: 235px 256px; animation: flameInner 0.8s ease-in-out infinite;">
                <path d="M 222 244 Q 220 222, 235 208 Q 250 222, 248 244 Q 246 255, 235 255 Q 224 255, 222 244 Z" fill="#FFF176" />
            </g>
        </svg>`
    },
    {
        id: 'leo_reading',
        num: 2,
        themeGenre: 'slice',
        name: 'Leo · Học Giả Cổ Thụ',
        badge: 'Góc Truyện Kể',
        badgeStyle: 'background:rgba(42,123,111,0.30);color:#7CE0D0;',
        quote: 'Mỗi trang sách cổ mở ra một thế giới kỳ diệu — đẩy kính lên và khám phá tiếp nào!',
        svg: `<svg viewBox="0 0 320 320" class="rm-char-svg w-full h-full">
            <rect x="25" y="232" width="270" height="22" rx="8" fill="#C8874B" /> <rect x="25" y="244" width="270" height="10" rx="5" fill="#A66B35" />
            <ellipse cx="142" cy="236" rx="68" ry="10" fill="#8C5524" opacity="0.35" />
            <g style="transform-origin: 186px 52px; animation: leoIdeaBulb 5.2s ease-out infinite;">
                <circle cx="186" cy="46" r="16" fill="#FEF08A" opacity="0.45" /> <path d="M 176 44 A 10 10 0 1 1 196 44 C 196 50, 192 52, 191 56 L 181 56 C 180 52, 176 50, 176 44 Z" fill="#FACC15" stroke="#CA8A04" stroke-width="2" />
                <rect x="182" y="56" width="8" height="4" rx="1.5" fill="#94A3B8" /> <line x1="186" y1="24" x2="186" y2="18" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />
            </g>
            <g style="transform-origin: 140px 195px; animation: breathe 3s ease-in-out infinite;">
                <path d="M 76 168 Q 68 232, 84 232 L 196 232 Q 212 232, 204 168 Q 174 152, 140 152 Q 106 152, 76 168 Z" fill="var(--rm-char-primary, #1F6E60)" /> <path d="M 96 154 Q 140 184, 184 154 L 176 178 Q 140 198, 104 178 Z" fill="var(--rm-char-accent, #D97706)" />
                <circle cx="140" cy="174" r="7.5" fill="#FBBF24" stroke="#FEF08A" stroke-width="2" /> <ellipse cx="140" cy="154" rx="16" ry="8" fill="#C9926B" />
                <g style="transform-origin: 140px 118px; animation: leoStoryHead 5.2s ease-in-out infinite;">
                    <circle cx="96" cy="122" r="11" fill="#E5AC83" /><circle cx="184" cy="122" r="11" fill="#E5AC83" /> <path d="M 98 88 Q 94 152, 140 154 Q 186 152, 182 88 Q 180 62, 140 62 Q 100 62, 98 88 Z" fill="#F2BE96" />
                    <ellipse cx="114" cy="128" rx="8" ry="4.5" fill="#E58F7C" opacity="0.5" /><ellipse cx="166" cy="128" rx="8" ry="4.5" fill="#E58F7C" opacity="0.5" />
                    <g style="transform-origin: 140px 114px; animation: blink 5.2s infinite;">
                        <circle cx="122" cy="114" r="12" fill="#FFFFFF" /><circle cx="158" cy="114" r="12" fill="#FFFFFF" />
                        <g style="animation: eyeScan 2.2s ease-in-out infinite;">
                            <circle cx="122" cy="116" r="5" fill="#2A1B12" /><circle cx="158" cy="116" r="5" fill="#2A1B12" /> <circle cx="120" cy="114" r="1.8" fill="#FFFFFF" /><circle cx="156" cy="114" r="1.8" fill="#FFFFFF" />
                        </g>
                    </g>
                    <g style="transform-origin: 140px 114px; animation: leoGlassesSlip 5.2s ease-in-out infinite;">
                        <circle cx="122" cy="114" r="14" fill="none" stroke="#3D261C" stroke-width="4.5" /> <circle cx="158" cy="114" r="14" fill="none" stroke="#3D261C" stroke-width="4.5" />
                        <path d="M 136 113 Q 140 109, 144 113" fill="none" stroke="#3D261C" stroke-width="4" /> <line x1="98" y1="112" x2="108" y2="113" stroke="#3D261C" stroke-width="3.5" />
                        <line x1="172" y1="113" x2="182" y2="112" stroke="#3D261C" stroke-width="3.5" />
                        <g style="animation: leoLensGlint 5.2s ease-out infinite;">
                            <line x1="116" y1="104" x2="126" y2="122" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" /> <line x1="152" y1="104" x2="162" y2="122" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
                        </g>
                    </g>
                    <path d="M 112 96 Q 122 92, 132 96" fill="none" stroke="#4E2F1E" stroke-width="3.5" stroke-linecap="round" /> <path d="M 148 96 Q 158 92, 168 96" fill="none" stroke="#4E2F1E" stroke-width="3.5" stroke-linecap="round" />
                    <path d="M 140 115 L 137 126 L 143 127" fill="none" stroke="#CE9268" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    <g style="animation: leoMouthNormal 5.2s infinite;"><path d="M 134 137 Q 140 141, 147 136" fill="none" stroke="#8C4A32" stroke-width="3" stroke-linecap="round" /></g>
                    <g style="animation: leoMouthSurprise 5.2s infinite;"><ellipse cx="140" cy="138" rx="4.5" ry="5" fill="#7C2D12" /></g>
                    <g style="animation: leoMouthSmile 5.2s infinite;"><path d="M 132 135 Q 140 145, 149 135 Z" fill="#E11D48" stroke="#7C2D12" stroke-width="2" /></g>
                    <path d="M 92 96 Q 84 68, 112 58 Q 140 46, 168 58 Q 194 68, 186 96 Q 172 80, 152 84 Q 130 88, 112 78 Q 98 84, 92 96 Z" fill="#54321D" /> <circle cx="115" cy="68" r="16" fill="#694027" /><circle cx="144" cy="62" r="18" fill="#694027" /><circle cx="168" cy="70" r="14" fill="#54321D" />
                </g>
                <path d="M 82 172 Q 66 192, 80 210" fill="none" stroke="var(--rm-char-primary, #18584C)" stroke-width="20" stroke-linecap="round" /> <path d="M 84 186 Q 112 174, 140 188 Q 168 174, 196 186 L 192 198 L 140 204 L 88 198 Z" fill="#FFFDF7" stroke="#E2D9C8" stroke-width="1.5" />
                <g style="transform-origin: 140px 190px; animation: pageTurn 3.2s ease-in-out infinite;">
                    <path d="M 140 188 Q 165 170, 190 181 L 188 190 Q 164 179, 140 192 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
                </g>
                <path d="M 80 188 Q 110 180, 140 192 L 140 236 L 86 232 Z" fill="#D97706" /> <path d="M 140 192 Q 170 180, 200 188 L 194 232 L 140 236 Z" fill="#B45309" />
                <rect x="135" y="189" width="10" height="48" rx="3" fill="#78350F" /> <rect x="158" y="200" width="22" height="22" rx="4" transform="rotate(-6 169 211)" fill="none" stroke="#FDE68A" stroke-width="2.5" />
                <circle cx="169" cy="211" r="4" fill="#FDE68A" /> <rect x="74" y="200" width="18" height="16" rx="8" fill="#F2BE96" stroke="#D99B72" stroke-width="1.5" />
                <g style="transform-origin: 198px 172px; animation: leoPushArm 5.2s ease-in-out infinite;">
                    <line x1="198" y1="172" x2="210" y2="192" stroke="var(--rm-char-primary, #18584C)" stroke-width="20" stroke-linecap="round" />
                    <g style="transform-origin: 210px 192px; animation: leoPushForearm 5.2s ease-in-out infinite;">
                        <line x1="210" y1="192" x2="196" y2="208" stroke="var(--rm-char-primary, #18584C)" stroke-width="18" stroke-linecap="round" /> <rect x="188" y="200" width="18" height="16" rx="8" fill="#F2BE96" stroke="#D99B72" stroke-width="1.5" />
                    </g>
                </g>
            </g>
            <ellipse cx="244" cy="232" rx="22" ry="6" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" /> <path d="M 228 194 L 231 230 Q 244 234, 257 230 L 260 194 Z" fill="#E0533C" />
            <ellipse cx="244" cy="194" rx="16" ry="5" fill="#F8FAFC" /><ellipse cx="244" cy="194" rx="13" ry="3.5" fill="#6F3E26" /> <path d="M 259 201 Q 271 201, 271 211 Q 271 221, 258 221" fill="none" stroke="#E0533C" stroke-width="5" stroke-linecap="round" />
            <path d="M 238 184 Q 233 172, 242 162" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" style="animation: steamCurl 2.3s ease-out infinite;" />
        </svg>`
    },
    {
        id: 'miko_lofi',
        num: 3,
        themeGenre: 'slice',
        name: 'Miko · Hoa Tiêu Sóng Nhạc',
        badge: 'Thanh Âm Dòng Sông',
        badgeStyle: 'background:rgba(142,84,233,0.30);color:#D0B3FF;',
        quote: 'Lắng nghe thanh âm sóng nước và nhịp điệu câu thoại để vượt qua Dòng Sông Thử Thách nhé!',
        svg: `<svg viewBox="0 0 320 320" class="rm-char-svg w-full h-full">
            <ellipse cx="160" cy="276" rx="76" ry="18" class="rm-char-floor-shadow" fill="#DFD0E8" />
            <g style="transform-origin: 160px 220px; animation: breathe 2.4s ease-in-out infinite;">
                <path d="M 98 252 Q 160 272, 222 252" fill="none" stroke="#312E81" stroke-width="24" stroke-linecap="round" /> <ellipse cx="110" cy="264" rx="18" ry="10" transform="rotate(-10 110 264)" fill="#F8FAFC" stroke="#C0DF6A" stroke-width="3" />
                <ellipse cx="210" cy="264" rx="18" ry="10" transform="rotate(10 210 264)" fill="#F8FAFC" stroke="#C0DF6A" stroke-width="3" /> <path d="M 102 178 Q 92 238, 108 252 L 212 252 Q 228 238, 218 178 Q 190 162, 160 162 Q 130 162, 102 178 Z" fill="var(--rm-char-primary, #7C3AED)" />
                <path d="M 120 170 Q 160 188, 200 170" fill="none" stroke="#5B21B6" stroke-width="8" stroke-linecap="round" /> <path d="M 126 220 L 194 220 L 200 250 L 120 250 Z" fill="var(--rm-char-accent, #6D28D9)" />
                <g style="transform-origin: 106px 184px; animation: mikoStoryHoldArm 4.8s ease-in-out infinite;">
                    <path d="M 106 184 Q 72 176, 86 142" fill="none" stroke="var(--rm-char-primary, #6D28D9)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <g style="transform-origin: 212px 184px; animation: mikoStoryTapArm 4.8s ease-in-out infinite;">
                    <path d="M 212 184 Q 238 206, 224 236" fill="none" stroke="var(--rm-char-primary, #6D28D9)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" /> <circle cx="222" cy="240" r="10.5" fill="#FAD2B8" />
                </g>
                <g style="transform-origin: 160px 142px; animation: mikoStoryHead 4.8s ease-in-out infinite;">
                    <path d="M 100 112 Q 88 160, 108 172 L 212 172 Q 232 160, 220 112 Q 210 66, 160 66 Q 110 66, 100 112 Z" fill="#2E1A3B" /> <path d="M 114 96 Q 110 160, 160 162 Q 210 160, 206 96 Z" fill="#FAD2B8" />
                    <path d="M 108 104 Q 138 118, 168 102 Q 186 114, 212 104 Q 204 72, 160 72 Q 116 72, 108 104 Z" fill="#2E1A3B" /> <path d="M 128 130 Q 138 121, 148 130" fill="none" stroke="#2E1A3B" stroke-width="4" stroke-linecap="round" />
                    <path d="M 172 130 Q 182 121, 192 130" fill="none" stroke="#2E1A3B" stroke-width="4" stroke-linecap="round" /> <ellipse cx="126" cy="140" rx="8" ry="4.5" fill="#F472B6" opacity="0.65" /><ellipse cx="194" cy="140" rx="8" ry="4.5" fill="#F472B6" opacity="0.65" />
                    <circle cx="160" cy="135" r="2.5" fill="#DFA585" />
                    <g style="animation: mikoMouthChill 4.8s infinite;"><path d="M 152 144 Q 160 150, 168 144" fill="none" stroke="#9F1239" stroke-width="3.2" stroke-linecap="round" /></g>
                    <g style="animation: mikoMouthSing 4.8s infinite;"><path d="M 151 143 Q 160 156, 169 143 Z" fill="#E11D48" /><ellipse cx="160" cy="149" rx="4.5" ry="2.5" fill="#FDA4AF" /></g>
                    <path d="M 95 118 C 95 50, 225 50, 225 118" fill="none" stroke="#94A3B8" stroke-width="7" stroke-linecap="round" /> <path d="M 122 74 C 142 58, 178 58, 198 74" fill="none" stroke="#C0DF6A" stroke-width="11" stroke-linecap="round" />
                    <rect x="85" y="108" width="16" height="40" rx="8" fill="#C0DF6A" stroke="#3F6212" stroke-width="2.5" /> <rect x="219" y="108" width="16" height="40" rx="8" fill="#C0DF6A" stroke="#3F6212" stroke-width="2.5" />
                    <circle cx="88" cy="136" r="9.5" fill="#FAD2B8" />
                </g>
            </g>
            <g style="transform-origin: 160px 128px; animation: mikoBassWave 4.8s ease-out infinite;">
                <circle cx="160" cy="128" r="78" fill="none" stroke="#38BDF8" stroke-width="3.5" stroke-dasharray="12 8" /> <circle cx="160" cy="128" r="92" fill="none" stroke="#C0DF6A" stroke-width="2.5" stroke-dasharray="8 10" />
            </g>
            <g style="transform-origin: 54px 128px; animation: mikoEqBars 4.8s ease-in-out infinite;">
                <rect x="44" y="116" width="5" height="24" rx="2.5" fill="#38BDF8" /><rect x="52" y="108" width="5" height="38" rx="2.5" fill="#C0DF6A" /><rect x="60" y="118" width="5" height="20" rx="2.5" fill="#8B5CF6" />
            </g>
            <g style="transform-origin: 266px 128px; animation: mikoEqBars 4.8s ease-in-out infinite;">
                <rect x="255" y="118" width="5" height="20" rx="2.5" fill="#8B5CF6" /><rect x="263" y="108" width="5" height="38" rx="2.5" fill="#C0DF6A" /><rect x="271" y="116" width="5" height="24" rx="2.5" fill="#38BDF8" />
            </g>
        </svg>`
    },
    {
        id: 'oscar_gym',
        num: 4,
        themeGenre: 'adventure',
        name: 'Oscar · Dũng Sĩ Vượt Thác',
        badge: 'Sức Mạnh Ý Chí',
        badgeStyle: 'background:rgba(255,107,74,0.25);color:#FF8A70;',
        quote: 'Mỗi thử thách khó như tảng đá chắn thác — nâng bổng qua đầu là mở ra chân trời mới!',
        svg: `<svg viewBox="0 0 320 320" class="rm-char-svg w-full h-full">
            <ellipse cx="160" cy="272" rx="74" ry="20" class="rm-char-floor-shadow" fill="#E2D3C3" /> <path d="M 128 222 L 122 262" stroke="#2B3548" stroke-width="20" stroke-linecap="round" />
            <path d="M 192 222 L 198 262" stroke="#2B3548" stroke-width="20" stroke-linecap="round" /> <path d="M 106 262 Q 106 274, 134 274 L 134 258 Z" fill="#EF4444" />
            <path d="M 214 262 Q 214 274, 186 274 L 186 258 Z" fill="#EF4444" />
            <g style="transform-origin: 160px 230px; animation: oscarStoryTorso 5.0s ease-in-out infinite;">
                <path d="M 108 152 Q 102 228, 116 232 L 204 232 Q 218 228, 212 152 Z" fill="var(--rm-char-primary, #FF6B4A)" /> <rect x="108" y="206" width="104" height="20" rx="6" fill="#451A03" />
                <rect x="148" y="204" width="24" height="24" rx="4" fill="#FBBF24" stroke="#B45309" stroke-width="3" /> <rect x="118" y="80" width="84" height="80" rx="38" fill="#D99B72" />
                <rect x="118" y="80" width="84" height="80" rx="38" fill="#EF4444" style="animation: oscarRedFace 5.0s ease-in-out infinite;" />
                <g style="transform-origin: 160px 44px; animation: oscarWinStar 5.0s ease-out infinite;">
                    <polygon points="160,26 165,38 178,38 168,46 172,58 160,50 148,58 152,46 142,38 155,38" fill="#FBBF24" stroke="#FEF08A" stroke-width="2" />
                </g>
                <circle cx="116" cy="122" r="10" fill="#C4855C" /><circle cx="204" cy="122" r="10" fill="#C4855C" /> <path d="M 116 124 Q 116 164, 160 164 Q 204 164, 204 124 L 194 124 Q 160 144, 126 124 Z" fill="#3B2316" />
                <g style="animation: oscarMouthGrit 5.0s infinite;">
                    <rect x="146" y="138" width="28" height="9" rx="4" fill="#FFFFFF" stroke="#3B2316" stroke-width="2" />
                </g>
                <g style="animation: oscarMouthWin 5.0s infinite;">
                    <path d="M 144 136 Q 160 152, 176 136 Z" fill="#FFFFFF" stroke="#3B2316" stroke-width="2" />
                </g>
                <path d="M 198 92 Q 218 88, 224 102" fill="none" stroke="#DC2626" stroke-width="9" stroke-linecap="round" /> <rect x="116" y="88" width="88" height="14" rx="7" fill="var(--rm-char-accent, #EF4444)" />
                <path d="M 131 110 Q 131 123, 142 123 Q 152 123, 152 110 Z" fill="#FFFFFF" /> <path d="M 168 110 Q 168 123, 178 123 Q 189 123, 189 110 Z" fill="#FFFFFF" />
                <circle cx="142" cy="116" r="5" fill="#1E1B18" /><circle cx="178" cy="116" r="5" fill="#1E1B18" /> <path d="M 130 104 L 150 110" stroke="#3B2316" stroke-width="4.5" stroke-linecap="round" />
                <path d="M 190 104 L 170 110" stroke="#3B2316" stroke-width="4.5" stroke-linecap="round" /> <ellipse cx="160" cy="124" rx="7" ry="5.5" fill="#B8764D" />
                <path d="M 106 96 Q 96 106, 103 113 Q 110 106, 106 96 Z" fill="#38BDF8" style="animation: sweatFly 1.5s ease-out infinite;" />
                <g style="transform-origin: 116px 164px; animation: oscarStoryUpperL 5.0s ease-in-out infinite;">
                    <line x1="116" y1="164" x2="84" y2="164" stroke="#D99B72" stroke-width="24" stroke-linecap="round" />
                    <g style="transform-origin: 84px 164px; animation: oscarStoryForeL 5.0s ease-in-out infinite;">
                        <line x1="84" y1="164" x2="84" y2="112" stroke="#D99B72" stroke-width="21" stroke-linecap="round" /> <rect x="73" y="122" width="22" height="10" rx="4" fill="#D97706" />
                    </g>
                </g>
                <g style="transform-origin: 204px 164px; animation: oscarStoryUpperR 5.0s ease-in-out infinite;">
                    <line x1="204" y1="164" x2="236" y2="164" stroke="#D99B72" stroke-width="24" stroke-linecap="round" />
                    <g style="transform-origin: 236px 164px; animation: oscarStoryForeR 5.0s ease-in-out infinite;">
                        <line x1="236" y1="164" x2="236" y2="112" stroke="#D99B72" stroke-width="21" stroke-linecap="round" /> <rect x="225" y="122" width="22" height="10" rx="4" fill="#D97706" />
                    </g>
                </g>
                <g style="animation: oscarStoryBarbell 5.0s ease-in-out infinite;">
                    <line x1="28" y1="108" x2="292" y2="108" stroke="#92400E" stroke-width="9" stroke-linecap="round" /> <rect x="34" y="76" width="24" height="64" rx="8" fill="#475569" stroke="#38BDF8" stroke-width="2.5" />
                    <rect x="60" y="86" width="16" height="44" rx="5" fill="#64748B" /> <rect x="262" y="76" width="24" height="64" rx="8" fill="#475569" stroke="#38BDF8" stroke-width="2.5" />
                    <rect x="244" y="86" width="16" height="44" rx="5" fill="#64748B" /> <rect x="76" y="99" width="20" height="18" rx="7" fill="#D99B72" stroke="#B8764D" stroke-width="2" />
                    <rect x="224" y="99" width="20" height="18" rx="7" fill="#D99B72" stroke="#B8764D" stroke-width="2" />
                </g>
            </g>
        </svg>`
    },
    {
        id: 'hana_canvas',
        num: 5,
        themeGenre: 'fairytale',
        name: 'Hana · Họa Sĩ Cổ Tích',
        badge: 'Ngôi Làng Cổ Tích',
        badgeStyle: 'background:rgba(249,115,22,0.25);color:#FDBA74;',
        quote: 'Mỗi câu chuyện cổ tích là một nét vẽ nhiệm màu — cẩn thận kẻo sơn bắn lên mũi giống mình nhé!',
        svg: `<svg viewBox="0 0 320 320" class="rm-char-svg w-full h-full">
            <ellipse cx="155" cy="268" rx="82" ry="20" class="rm-char-floor-shadow" fill="#E5DEC9" /> <line x1="212" y1="86" x2="186" y2="264" stroke="#9A5818" stroke-width="7" stroke-linecap="round" />
            <line x1="238" y1="86" x2="266" y2="264" stroke="#9A5818" stroke-width="7" stroke-linecap="round" /> <line x1="226" y1="86" x2="232" y2="264" stroke="#78420E" stroke-width="6" stroke-linecap="round" />
            <polygon points="180,102 188,96 188,192 180,196" fill="#E2D9C5" /> <polygon points="188,96 262,104 262,196 188,192" fill="#FFFDF9" stroke="#D97706" stroke-width="4.5" stroke-linejoin="round" />
            <circle cx="228" cy="130" r="13" fill="#FBBF24" /> <polygon points="192,190 214,154 236,191" fill="#34D399" />
            <polygon points="218,191 242,148 258,193" fill="#10B981" /> <path d="M 198 140 Q 218 122, 246 138" fill="none" stroke="#EC4899" stroke-width="5" stroke-linecap="round" />
            <polygon points="174,190 268,195 268,203 174,198" fill="#B45309" />
            <g style="transform-origin: 108px 210px; animation: breathe 2.8s ease-in-out infinite;">
                <line x1="94" y1="242" x2="94" y2="264" stroke="#1E293B" stroke-width="14" stroke-linecap="round" /> <line x1="126" y1="242" x2="126" y2="264" stroke="#1E293B" stroke-width="14" stroke-linecap="round" />
                <ellipse cx="90" cy="266" rx="12" ry="7" fill="#78350F" /><ellipse cx="130" cy="266" rx="12" ry="7" fill="#78350F" /> <rect x="100" y="150" width="20" height="22" rx="8" fill="#E5B293" />
                <path d="M 68 182 C 68 160, 150 160, 150 182 L 146 248 L 74 248 Z" fill="#FDE68A" /> <path d="M 80 172 L 74 248 L 144 248 L 138 172 Z" fill="var(--rm-char-primary, #2563EB)" />
                <rect x="88" y="206" width="42" height="26" rx="6" fill="#1D4ED8" stroke="#60A5FA" stroke-width="2" /> <path d="M 90 164 Q 110 178, 130 164 L 135 176 L 85 176 Z" fill="#EF4444" />
                <path d="M 74 182 Q 55 198, 66 212" fill="none" stroke="#F7D3BA" stroke-width="15" stroke-linecap="round" /> <ellipse cx="66" cy="208" rx="25" ry="17" transform="rotate(-15 66 208)" fill="#D99B52" stroke="#A66E2E" stroke-width="2.5" />
                <circle cx="52" cy="205" r="4.5" fill="#EF4444" /><circle cx="62" cy="197" r="4.5" fill="#10B981" /><circle cx="74" cy="199" r="4.5" fill="#3B82F6" />
                <g style="transform-origin: 110px 132px; animation: hanaStoryHead 4.8s ease-in-out infinite;">
                    <path d="M 68 115 Q 60 155, 76 168 L 144 168 Q 160 155, 152 115 Z" fill="#4A2C1D" /> <rect x="76" y="90" width="68" height="70" rx="32" fill="#FAD5BE" />
                    <g style="animation: hanaEyesNormal 4.8s infinite;">
                        <g style="transform-origin: 118px 122px; animation: blink 4.6s infinite;">
                            <path d="M 96 116 Q 96 130, 108 130 Q 116 130, 116 116 Z" fill="#FFFFFF" /> <path d="M 122 116 Q 122 130, 134 130 Q 141 130, 141 116 Z" fill="#FFFFFF" />
                            <ellipse cx="109" cy="123" rx="4.8" ry="5.8" fill="#222" /><ellipse cx="134" cy="123" rx="4.8" ry="5.8" fill="#222" /> <circle cx="107" cy="120" r="1.8" fill="#FFF" /><circle cx="132" cy="120" r="1.8" fill="#FFF" />
                        </g>
                    </g>
                    <g style="animation: hanaEyesLaugh 4.8s infinite;">
                        <path d="M 96 122 Q 106 112, 116 122" fill="none" stroke="#4A2C1D" stroke-width="4" stroke-linecap="round" /> <path d="M 122 122 Q 132 112, 142 122" fill="none" stroke="#4A2C1D" stroke-width="4" stroke-linecap="round" />
                    </g>
                    <ellipse cx="120" cy="130" rx="4" ry="5" fill="#E5A985" />
                    <g style="transform-origin: 120px 130px; animation: hanaPaintNose 4.8s ease-out infinite;">
                        <circle cx="120" cy="130" r="6.5" fill="#EC4899" /><circle cx="103" cy="136" r="4.5" fill="#EC4899" />
                    </g>
                    <g style="animation: hanaMouthNormal 4.8s infinite;"><path d="M 111 141 Q 118 147, 126 141" fill="none" stroke="#9A3412" stroke-width="3" stroke-linecap="round" /></g>
                    <g style="animation: hanaMouthLaugh 4.8s infinite;"><path d="M 109 139 Q 119 151, 129 139 Z" fill="#E11D48" stroke="#9A3412" stroke-width="2" /></g>
                    <path d="M 64 100 Q 68 68, 114 72 Q 154 75, 154 96 Q 114 90, 64 100 Z" fill="var(--rm-char-accent, #F97316)" /> <rect x="74" y="92" width="72" height="8" rx="4" fill="#C2410C" />
                </g>
                <g style="transform-origin: 208px 136px; animation: hanaPaintFly 4.8s ease-out infinite;">
                    <circle cx="208" cy="136" r="5.5" fill="#EC4899" /><circle cx="215" cy="140" r="3.5" fill="#F472B6" />
                </g>
                <g style="transform-origin: 136px 180px; animation: hanaStoryUpperArm 4.8s ease-in-out infinite;">
                    <path d="M 136 180 Q 148 178, 158 172" fill="none" stroke="#FAD5BE" stroke-width="16" stroke-linecap="round" />
                    <g style="transform-origin: 158px 172px; animation: hanaStoryForearm 4.8s ease-in-out infinite;">
                        <path d="M 158 172 L 174 160" fill="none" stroke="#FAD5BE" stroke-width="15" stroke-linecap="round" /> <line x1="166" y1="166" x2="206" y2="136" stroke="#78350F" stroke-width="5.5" stroke-linecap="round" />
                        <path d="M 204 138 Q 214 128, 220 133 Q 215 143, 204 138 Z" fill="#EC4899" /> <circle cx="176" cy="158" r="9.5" fill="#FAD5BE" stroke="#E5B293" stroke-width="1.5" />
                    </g>
                </g>
            </g>
        </svg>`
    }
];
