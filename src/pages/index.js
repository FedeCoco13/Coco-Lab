import React from 'react';
import { ShoppingCart, Calendar, Book, FileText, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';

const Logo = () => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-10 md:h-12 w-10 md:w-12">
<path style="fill:#ffffff; stroke:none;" d="M0 0L0 211L201 211L201 0L0 0z"/>
<path style="fill:#edc7bb; stroke:none;" d="M86 23C88.0521 23.8742 89.7472 23.9528 92 24C89.9479 23.1258 88.2528 23.0472 86 23z"/>
<path style="fill:#f3cab9; stroke:none;" d="M72 24C73.2484 24.6848 73.5484 24.7488 75 25C73.7517 24.3152 73.4515 24.2512 72 24z"/>
<path style="fill:#b6846f; stroke:none;" d="M75 24C76.506 24.683 77.3148 24.8259 79 25C77.4939 24.317 76.6852 24.1741 75 24z"/>
<path style="fill:#9d5f4b; stroke:none;" d="M79 24C80.2484 24.6848 80.5484 24.7488 82 25C80.7517 24.3152 80.4515 24.2512 79 24z"/>
<path style="fill:#8e492b; stroke:none;" d="M42 118C43.9419 113.371 42.4362 108.614 41.0247 104C38.7096 96.4314 36.2015 89.146 32.7415 82C31.2146 78.8464 27.8024 74.6048 27.6775 71.0432C27.5438 67.234 32.4988 65.5624 34.8912 63.4715C37.9578 60.7913 38.7859 57.9098 39 54C48.3338 67.1107 52.5249 83.6059 56.3735 99C58.4336 107.241 60.8656 115.576 62 124C64.7387 117.473 62.3988 108.603 60.7307 102C57.8376 90.5483 55.2792 79.1586 51.3079 68C49.7568 63.6419 48.1092 59.2978 46.3966 55.0008C45.662 53.1576 44.0747 50.5798 44.662 48.5177C45.3146 46.2266 48.2718 44.8935 49.9622 43.4823C52.9556 40.9831 55.3652 37.8587 58 35C61.4018 49.3549 66.8719 63.623 70.8287 77.9105C72.1512 82.686 74.1841 86.9622 74.5802 92C75.0611 98.1151 74.0414 110.698 81 113C80.8985 103.806 78.5965 94.0354 76.8002 85C73.4236 68.017 69.1204 49.4075 61 34C67.6461 32.1323 74.1918 32.0748 81 31.2855C83.6465 30.9787 87.309 30.516 89.3966 32.6034C93.1384 36.3448 90.9997 48.0677 91 53C91.0007 64.1468 92.6486 74.999 93.8264 86C94.4028 91.3843 94.0028 96.6288 95 102C97.083 97.036 96.0086 90.3456 96 85C95.9742 68.9789 92.1328 53.0371 92 37C99.0017 38.8115 112.547 38.4639 117.397 44.3943C120.896 48.6727 118.318 58.9063 117.715 64C116.489 74.3432 115.622 84.6255 114.91 95C114.526 100.613 113.671 105.417 115 111C119.608 103.666 117.955 94.2116 118.193 86C118.397 78.9632 120.056 71.968 120.872 65C121.493 59.6922 121.149 54.2556 122 49C126.918 51.5879 136.473 54.6595 138.799 60.0934C140.214 63.3997 138.161 68.6861 137.335 72C134.931 81.6433 132.309 91.2251 130.4 101C129.449 105.876 128.44 111.134 132 115C134.155 98.3165 139.607 82.3927 143 66C146.412 66.9828 150.032 68.2826 152.775 70.6373C157.755 74.9114 158.426 79.5441 166 80C166.899 82.1236 166.876 82.1007 169 83C169.49 74.7458 164.418 74.4923 159.563 69.3665C157.989 67.7044 157.615 65.3551 156.147 63.6335C154.285 61.4516 151.333 60.2578 149.015 58.6404C145.278 56.0324 143.367 51.9624 139.787 49.3241C134.914 45.7333 128.982 43.6377 124.144 40.0386C122.087 38.5086 120.973 35.9088 118.701 34.7022C115.88 33.2035 112.084 33.0556 109 32.3488C102.983 30.9698 97.0466 29.248 91 28L92 25C83.5894 24.9777 75.378 24.7218 67 25.7145C64.5928 25.9997 61.6222 25.575 59.3789 26.6034C56.6096 27.8729 55.0633 31.3374 52.8148 33.3202C48.807 36.8544 43.7711 38.9202 40.2284 43.0401C37.1678 46.5993 38.0445 51.1883 35.3966 54.6744C31.1325 60.2882 21.4844 61.6133 21.1636 70C20.9178 76.4245 27.0312 83.5568 29.9722 89C34.9769 98.2626 36.8068 108.951 42 118z"/>
<path style="fill:#754225; stroke:none;" d="M83 24C85.8897 25.2129 88.8741 24.9983 92 25C89.1103 23.787 86.1259 24.0017 83 24z"/>
<path style="fill:#dbbead; stroke:none;" d="M58 25C59.2483 25.6848 59.5485 25.7488 61 26C59.7516 25.3152 59.4516 25.2512 58 25z"/>
<path style="fill:#ac8875; stroke:none;" d="M61 25C62.506 25.683 63.3148 25.8259 65 26C63.494 25.317 62.6852 25.1741 61 25z"/>
<path style="fill:#84614d; stroke:none;" d="M65 25C66.506 25.683 67.3148 25.8259 69 26C67.4939 25.317 66.6852 25.1741 65 25z"/>
<path style="fill:#bd8f7c; stroke:none;" d="M91 26L92 27L91 26z"/>
<path style="fill:#c8ab9d; stroke:none;" d="M57 27L58 28L57 27z"/>
<path style="fill:#f2bea9; stroke:none;" d="M91 27L92 28L91 27z"/>
<path style="fill:#a97f68; stroke:none;" d="M93 28L94 29L93 28z"/>
<path style="fill:#dfb9a1; stroke:none;" d="M94 28L95 29L94 28z"/>
<path style="fill:#e9cab5; stroke:none;" d="M56 29L57 30L56 29z"/>
<path style="fill:#b69a8d; stroke:none;" d="M97 29L98 30L97 29z"/>
<path style="fill:#c79988; stroke:none;" d="M101 30L102 31L101 30z"/>
<path style="fill:#7c3a29; stroke:none;" d="M79 31C82.4324 32.4403 86.2998 32 90 32C86.5676 30.5597 82.7002 31 79 31z"/>
<path style="fill:#af897c; stroke:none;" d="M105 31L106 32L105 31z"/>
<path style="fill:#e6c7bd; stroke:none;" d="M106 31L107 32L106 31z"/>
<path style="fill:#9d7566; stroke:none;" d="M54 32L55 33L54 32z"/>
<path style="fill:#7a442b; stroke:none;" d="M66 32C68.6127 33.0977 71.1645 32.9928 74 33C71.3873 31.9023 68.8355 32.0072 66 32z"/>
<path style="fill:#8c5e51; stroke:none;" d="M74 32C75.2484 32.6848 75.5484 32.7488 77 33C75.7517 32.3152 75.4515 32.2512 74 32z"/>
<path style="fill:#b89581; stroke:none;" d="M77 32C78.506 32.683 79.3148 32.8259 81 33C79.4939 32.317 78.6852 32.1741 77 32z"/>
<path style="fill:#e6c6b7; stroke:none;" d="M81 32C83.8897 33.2129 86.8741 32.9983 90 33C87.1103 31.7871 84.1259 32.0017 81 32z"/>
<path style="fill:#965d47; stroke:none;" d="M90 32L90 48C91.8123 43.6811 91.8123 36.3189 90 32z"/>
<path style="fill:#c79480; stroke:none;" d="M109.667 32.3333C109.222 32.7778 110.278 32.7222 110.333 32.6667C110.778 32.2223 109.722 32.2777 109.667 32.3333z"/>
<path style="fill:#955d4f; stroke:none;" d="M62 33C63.506 33.683 64.3148 33.8259 66 34C64.4939 33.317 63.6852 33.1741 62 33z"/>
<path style="fill:#bc8776; stroke:none;" d="M66 33C67.2484 33.6848 67.5484 33.7488 69 34C67.7517 33.3152 67.4515 33.2512 66 33z"/>
<path style="fill:#e9c4b0; stroke:none;" d="M69.6667 33.3333C69.2222 33.7778 70.2778 33.7222 70.3333 33.6667C70.7778 33.2222 69.7222 33.2778 69.6667 33.3333z"/>
<path style="fill:#ffffff; stroke:none;" d="M62 34C66.9818 55.0225 78.0512 74.9585 79 97C82.5573 93.5164 83.6688 85.9853 84 81C85.1818 83.4297 85.7305 85.3127 86 88C90.583 79.3798 85.052 70.8685 84.7184 62C84.5531 57.6073 87.148 52.3907 88 48C89.3935 53.0684 87.7415 57.9983 87.6551 63.1698C87.5794 67.6993 89.0227 72.585 90 77C92.0821 73.1306 91.0541 68.3115 90.9961 64C90.8574 53.6785 90 43.3808 90 33L62 34z"/>
<path style="fill:#cea898; stroke:none;" d="M114.667 33.3333C114.222 33.7778 115.278 33.7222 115.333 33.6667C115.778 33.2222 114.722 33.2778 114.667 33.3333z"/>
<path style="fill:#edc7b7; stroke:none;" d="M51 34L52 35L51 34z"/>
<path style="fill:#c68d78; stroke:none;" d="M61 34L62 35L61 34z"/>
<path style="fill:#c1a097; stroke:none;" d="M119.667 34.3333C119.222 34.7778 120.278 34.7223 120.333 34.6667C120.778 34.2222 119.722 34.2778 119.667 34.3333z"/>
<path style="fill:#a67b6e; stroke:none;" d="M50 35L51 36L50 35z"/>
<path style="fill:#eaaf9a; stroke:none;" d="M57 35L58 36L57 35z"/>
<path style="fill:#dfb49a; stroke:none;" d="M48 36L49 37L48 36z"/>
<path style="fill:#ffffff; stroke:none;" d="M56 36C53.2279 39.9349 45.8339 44.3878 44.9823 49.0895C44.5138 51.6759 46.274 54.6802 47.1998 57C49.4391 62.6106 51.425 68.2694 53.3333 74C59.0115 91.0509 64 108.973 64 127L62 127C61.2497 109.791 54.8532 90.1067 48.9468 74C46.8082 68.1682 44.36 59.511 39 56C37.3649 62.8198 31.6074 65.5557 26 69C29.1533 75.7538 33.1206 82.0884 35.9884 89C43.7338 107.667 48.9441 129.727 49 150C52.208 148.618 55.0841 146.923 58 145C57.2891 142.115 56.885 140.839 54 140L55 136C57.0955 137.043 58.6987 137.603 61 138C59.8607 136.985 59.3884 136.691 58 136C60.7299 131.678 65.5995 128.245 71.0748 129.174C74.233 129.71 76.8518 131.859 80.0394 132.441C86.493 133.62 93.4677 133 100 133C94.581 130.251 89.8521 130.891 84 131C85.4785 130.014 85.2032 130 87 130L86 127C89.4436 126.142 92.7247 125.397 96 124C95.2583 120.432 93.7138 118.4 91 116C90.2776 118.418 90.0519 120.472 90 123L86 123L85 117L88 118C85.6018 111.993 83.9562 106.169 82 100C79.6204 104.166 81.4213 109.425 82 114C74.0512 111.141 74.8744 100.201 73.5756 93C70.0447 73.4234 64.3552 54.7857 58 36L56 36z"/>
<path style="fill:#d4b1a7; stroke:none;" d="M62 36L63 37L62 36z"/>
<path style="fill:#e1b59f; stroke:none;" d="M121 36L121 39C121.696 37.4463 121.696 37.5537 121 36z"/>
<path style="fill:#c09885; stroke:none;" d="M55 37L56 38L55 37z"/>
<path style="fill:#af7e67; stroke:none;" d="M58 37L59 38L58 37z"/>
<path style="fill:#be967d; stroke:none;" d="M92 37L92 40C93.0154 38.8607 93.3087 38.3884 94 37L92 37z"/>
<path style="fill:#ab7669; stroke:none;" d="M45 38L46 39L45 38z"/>
<path style="fill:#a0806d; stroke:none;" d="M54 38L55 39L54 38z"/>
<path style="fill:#dcbbac; stroke:none;" d="M96 38L97 39L96 38z"/>
<path style="fill:#8f5e4e; stroke:none;" d="M97.6667 38.3333C97.2222 38.7778 98.2778 38.7222 98.3333 38.6667C98.7778 38.2222 97.7222 38.2778 97.6667 38.3333z"/>
<path style="fill:#e4c5b3; stroke:none;" d="M43 39L44 40L43 39z"/>
<path style="fill:#bd8a75; stroke:none;" d="M63 39L64 40L63 39z"/>
<path style="fill:#f0c7b5; stroke:none;" d="M100.667 39.3333C100.222 39.7778 101.278 39.7222 101.333 39.6667C101.778 39.2222 100.722 39.2778 100.667 39.3333z"/>
<path style="fill:#a6725a; stroke:none;" d="M102.667 39.3333C102.222 39.7778 103.278 39.7222 103.333 39.6667C103.778 39.2222 102.722 39.2778 102.667 39.3333z"/>
<path style="fill:#a88774; stroke:none;" d="M122 39L123 40L122 39z"/>
<path style="fill:#be8f7c; stroke:none;" d="M42 40L43 41L42 40z"/>
<path style="fill:#cda995; stroke:none;" d="M59 40L60 41L59 40z"/>
<path style="fill:#8e6149; stroke:none;" d="M92 40L92 45C92.8299 42.9695 92.8299 42.0305 92 40z"/>
<path style="fill:#e5c4b5; stroke:none;" d="M107 40L108 41L107 40z"/>
<path style="fill:#946754; stroke:none;" d="M108.667 40.3333C108.222 40.7778 109.278 40.7222 109.333 40.6667C109.778 40.2222 108.722 40.2778 108.667 40.3333z"/>
<path style="fill:#bf8b7f; stroke:none;" d="M124 40L125 41L124 40z"/>
<path style="fill:#9e7866; stroke:none;" d="M41 41L42 42L41 41z"/>
<path style="fill:#d7b6a7; stroke:none;" d="M64 41L65 42L64 41z"/>
<path style="fill:#d5a997; stroke:none;" d="M112 41L113 42L112 41z"/>
<path style="fill:#a7745d; stroke:none;" d="M113 41L114 42L113 41z"/>
<path style="fill:#c0a59a; stroke:none;" d="M126 41L127 42L126 41z"/>
<path style="fill:#9f7262; stroke:none;" d="M40 42L41 43L40 42z"/>
<path style="fill:#a77563; stroke:none;" d="M60 42L61 43L60 42z"/>
<path style="fill:#99755c; stroke:none;" d="M64 42L65 43L64 42z"/>
<path style="fill:#d0b19b; stroke:none;" d="M115 42L116 43L115 42z"/>
<path style="fill:#ecbeb0; stroke:none;" d="M128 42L129 43L128 42z"/>
<path style="fill:#987965; stroke:none;" d="M39 43L40 44L39 43z"/>
<path style="fill:#d9b8a5; stroke:none;" d="M38 44L39 45L38 44z"/>
<path style="fill:#cea49c; stroke:none;" d="M48 44L49 45L48 44z"/>
<path style="fill:#d6a992; stroke:none;" d="M65 44L66 45L65 44z"/>
<path style="fill:#ecc5b5; stroke:none;" d="M118 44L118 48C118.71 46.2405 118.71 45.7595 118 44z"/>
<path style="fill:#b48374; stroke:none;" d="M131 44L132 45L131 44z"/>
<path style="fill:#f8cfbf; stroke:none;" d="M47 45L48 46L47 45z"/>
<path style="fill:#ae8e78; stroke:none;" d="M61 45L62 46L61 45z"/>
<path style="fill:#d0a89b; stroke:none;" d="M133 45L134 46L133 45z"/>
<path style="fill:#d5ac9a; stroke:none;" d="M37 46L38 47L37 46z"/>
<path style="fill:#a9836d; stroke:none;" d="M45 46L46 47L45 46z"/>
<path style="fill:#ecc4b1; stroke:none;" d="M135 46L136 47L135 46z"/>
<path style="fill:#eec4ae; stroke:none;" d="M44 47L45 48L44 47z"/>
<path style="fill:#bc9b8a; stroke:none;" d="M66 47L67 48L66 47z"/>
<path style="fill:#a37765; stroke:none;" d="M136 47L137 48L136 47z"/>
<path style="fill:#ae775a; stroke:none;" d="M43 48L44 49L43 48z"/>
<path style="fill:#c89b85; stroke:none;" d="M62 48L63 49L62 48z"/>
<path style="fill:#feffff; stroke:none;" d="M88 48C86.9342 52.1072 84.6567 56.8168 84.392 61C84.0444 66.493 86.9707 72.5717 87.7261 78C88.1856 81.3017 87.2598 84.7078 87 88L85 81C81.8372 87.0214 80.1956 95.235 80 102C81.1954 101.402 80.9774 101.534 82 100C83.462 106.396 84.7269 112.265 88 118C86.5215 117.014 86.7968 117 85 117L86 123L90 123C90.1095 120.558 90.428 118.377 91 116C93.1175 118.613 94.8968 120.81 96 124C93.8501 124.566 88.8617 125.264 87.1667 126.5C84.8701 128.175 87.3879 129.563 84 130C88.23 131.764 95.3003 131.732 100 132C93.6943 133.864 85.488 133.409 79.0895 131.867C76.2846 131.191 73.9308 129.216 71.0748 128.742C65.6955 127.848 60.0588 131.278 58 136C59.4785 136.986 59.2032 137 61 137C58.685 137.07 57.2206 136.74 55 136L54 140C56.0191 141.15 56.7234 142.015 58 144C65.8372 140.753 72.3989 136.782 81 135.439C92.8556 133.587 104.273 136.497 116 137C114.494 136.317 113.685 136.174 112 136L112 133L121 132L121 130L115 130C113.928 120.678 106.315 127.929 100 128C99.9779 121.751 98.2004 117.338 92 115C92.738 112.887 92.8079 112.293 95 112C94.9649 99.2819 92.0014 86.7413 92 74C91.3152 75.2483 91.2512 75.5484 91 77C89.0725 72.7739 87.9228 67.6655 88.0602 63C88.2027 58.1622 89.8847 52.5338 88 48z"/>
<path style="fill:#bc8b73; stroke:none;" d="M90 48L90 54C90.9511 51.7147 90.9511 50.2853 90 48z"/>
<path style="fill:#f4c6b2; stroke:none;" d="M93 48L93 51C93.6961 49.4463 93.6961 49.5537 93 48z"/>
<path style="fill:#bd9179; stroke:none;" d="M118 48L118 51C118.696 49.4463 118.696 49.5537 118 48z"/>
<path style="fill:#ba8876; stroke:none;" d="M138 48L139 49L138 48z"/>
<path style="fill:#e5c0ac; stroke:none;" d="M36 49L36 52C36.6961 50.4463 36.6961 50.5537 36 49z"/>
<path style="fill:#f9d2c4; stroke:none;" d="M67 49L68 50L67 49z"/>
<path style="fill:#eccab4; stroke:none;" d="M122.333 49.6667C122.278 49.7222 122.222 50.7778 122.667 50.3333C122.722 50.2777 122.778 49.2223 122.333 49.6667z"/>
<path style="fill:#c0937e; stroke:none;" d="M123 49L124 50L123 49z"/>
<path style="fill:#b39079; stroke:none;" d="M140 49L141 50L140 49z"/>
<path style="fill:#ac8c7d; stroke:none;" d="M44 50L45 51L44 50z"/>
<path style="fill:#aa7e6e; stroke:none;" d="M67 50L68 51L67 50z"/>
<path style="fill:#72371d; stroke:none;" d="M121 50L121 54C121.71 52.2405 121.71 51.7595 121 50z"/>
<path style="fill:#be9a86; stroke:none;" d="M63 51L64 52L63 51z"/>
<path style="fill:#c2927c; stroke:none;" d="M93 51L93 54C93.6961 52.4463 93.6961 52.5537 93 51z"/>
<path style="fill:#995b4d; stroke:none;" d="M118 51L118 55C118.71 53.2405 118.71 52.7595 118 51z"/>
<path style="fill:#e5bfb1; stroke:none;" d="M126 51L127 52L126 51z"/>
<path style="fill:#b58a85; stroke:none;" d="M142 51L143 52L142 51z"/>
<path style="fill:#ca9b81; stroke:none;" d="M36 52L36 55C36.6961 53.4463 36.6961 53.5537 36 52z"/>
<path style="fill:#cfa294; stroke:none;" d="M45 52L46 53L45 52z"/>
<path style="fill:#ebcabd; stroke:none;" d="M128 52L129 53L128 52z"/>
<path style="fill:#a4846c; stroke:none;" d="M68 53L69 54L68 53z"/>
<path style="fill:#dfb5a6; stroke:none;" d="M130 53L131 54L130 53z"/>
<path style="fill:#f1c4b4; stroke:none;" d="M143 53L144 54L143 53z"/>
<path style="fill:#ffcbb6; stroke:none;" d="M39.3333 54.6667C39.2777 54.7223 39.2223 55.7777 39.6667 55.3333C39.7222 55.2778 39.7778 54.2222 39.3333 54.6667z"/>
<path style="fill:#b27e70; stroke:none;" d="M64 54L65 55L64 54z"/>
<path style="fill:#e7c5b3; stroke:none;" d="M90 54L90 58C90.7102 56.2405 90.7102 55.7595 90 54z"/>
<path style="fill:#d3b29d; stroke:none;" d="M132 54L133 55L132 54z"/>
<path style="fill:#ac816d; stroke:none;" d="M35 55L36 56L35 55z"/>
<path style="fill:#c28d77; stroke:none;" d="M40 55L41 56L40 55z"/>
<path style="fill:#a17b67; stroke:none;" d="M46 55L47 56L46 55z"/>
<path style="fill:#fcd4c1; stroke:none;" d="M69 55L70 56L69 55z"/>
<path style="fill:#b98e71; stroke:none;" d="M134 55L135 56L134 55z"/>
<path style="fill:#987868; stroke:none;" d="M144 55L145 56L144 55z"/>
<path style="fill:#c79783; stroke:none;" d="M69 56L70 57L69 56z"/>
<path style="fill:#a4745e; stroke:none;" d="M145 56L146 57L145 56z"/>
<path style="fill:#b38e78; stroke:none;" d="M32 57L33 58L32 57z"/>
<path style="fill:#d7b7a9; stroke:none;" d="M41 57L42 58L41 57z"/>
<path style="fill:#cea995; stroke:none;" d="M47 57L48 58L47 57z"/>
<path style="fill:#733521; stroke:none;" d="M93 57L93 61C93.7102 59.2405 93.7102 58.7595 93 57z"/>
<path style="fill:#b38c71; stroke:none;" d="M121.333 57.6667C121.278 57.7222 121.222 58.7778 121.667 58.3333C121.722 58.2777 121.778 57.2223 121.333 57.6667z"/>
<path style="fill:#a27b67; stroke:none;" d="M137 57L138 58L137 57z"/>
<path style="fill:#eec8b1; stroke:none;" d="M30 58L31 59L30 58z"/>
<path style="fill:#dab9aa; stroke:none;" d="M65 58L66 59L65 58z"/>
<path style="fill:#e0c0b6; stroke:none;" d="M117 58L117 61C117.696 59.4463 117.696 59.5537 117 58z"/>
<path style="fill:#c7a792; stroke:none;" d="M138 58L139 59L138 58z"/>
<path style="fill:#e4b7a1; stroke:none;" d="M148 58L149 59L148 58z"/>
<path style="fill:#a6806b; stroke:none;" d="M29 59L30 60L29 59z"/>
<path style="fill:#dbb9ac; stroke:none;" d="M38 59L39 60L38 59z"/>
<path style="fill:#efc1b0; stroke:none;" d="M42 59L43 60L42 59z"/>
<path style="fill:#966c5a; stroke:none;" d="M70.3333 59.6667C70.2778 59.7222 70.2222 60.7778 70.6667 60.3333C70.7223 60.2777 70.7777 59.2223 70.3333 59.6667z"/>
<path style="fill:#ebc2aa; stroke:none;" d="M121 59L121 62C121.696 60.4463 121.696 60.5537 121 59z"/>
<path style="fill:#b48f7b; stroke:none;" d="M48 60L49 61L48 60z"/>
<path style="fill:#dbbeb4; stroke:none;" d="M94.3333 60.6667C94.2778 60.7222 94.2222 61.7778 94.6667 61.3333C94.7223 61.2777 94.7778 60.2223 94.3333 60.6667z"/>
<path style="fill:#ac7560; stroke:none;" d="M151 60L152 61L151 60z"/>
<path style="fill:#b08c79; stroke:none;" d="M26 61L27 62L26 61z"/>
<path style="fill:#eecebc; stroke:none;" d="M43 61L44 62L43 61z"/>
<path style="fill:#b68979; stroke:none;" d="M66 61L67 62L66 61z"/>
<path style="fill:#c18f8a; stroke:none;" d="M117.333 61.6667C117.278 61.7222 117.222 62.7778 117.667 62.3333C117.722 62.2777 117.778 61.2223 117.333 61.6667z"/>
<path style="fill:#a27665; stroke:none;" d="M153 61L154 62L153 61z"/>
<path style="fill:#efd1b7; stroke:none;" d="M36 62L37 63L36 62z"/>
<path style="fill:#f5d0bb; stroke:none;" d="M49 62L50 63L49 62z"/>
<path style="fill:#f3d2bf; stroke:none;" d="M66 62L67 63L66 62z"/>
<path style="fill:#dcb3a1; stroke:none;" d="M71 62L72 63L71 62z"/>
<path style="fill:#b49287; stroke:none;" d="M94 62L94 65C94.6961 63.4463 94.6961 63.5537 94 62z"/>
<path style="fill:#cba998; stroke:none;" d="M139 62L140 63L139 62z"/>
<path style="fill:#b68f7b; stroke:none;" d="M155 62L156 63L155 62z"/>
<path style="fill:#eecaaf; stroke:none;" d="M44 63L45 64L44 63z"/>
<path style="fill:#a37861; stroke:none;" d="M49 63L50 64L49 63z"/>
<path style="fill:#8c6250; stroke:none;" d="M91 63L91 67C91.7102 65.2405 91.7102 64.7595 91 63z"/>
<path style="fill:#8e6251; stroke:none;" d="M117 63L117 66C117.696 64.4463 117.696 64.5537 117 63z"/>
<path style="fill:#a28175; stroke:none;" d="M33 64L34 65L33 64z"/>
<path style="fill:#92725d; stroke:none;" d="M67 64L68 65L67 64z"/>
<path style="fill:#cbb19e; stroke:none;" d="M45 65L46 66L45 65z"/>
<path style="fill:#d4baab; stroke:none;" d="M50 65L51 66L50 65z"/>
<path style="fill:#c0a693; stroke:none;" d="M67 65L68 66L67 65z"/>
<path style="fill:#8d6150; stroke:none;" d="M94 65L94 68C94.6961 66.4463 94.6961 66.5537 94 65z"/>
<path style="fill:#cc9a8a; stroke:none;" d="M157 65L158 66L157 65z"/>
<path style="fill:#caa69b; stroke:none;" d="M21 66L22 67L21 66z"/>
<path style="fill:#dabea9; stroke:none;" d="M30 66L31 67L30 66z"/>
<path style="fill:#bd9989; stroke:none;" d="M72 66L73 67L72 66z"/>
<path style="fill:#be9884; stroke:none;" d="M138 66L139 67L138 66z"/>
<path style="fill:#b0927d; stroke:none;" d="M145 66L146 67L145 66z"/>
<path style="fill:#ce9f92; stroke:none;" d="M28 67L29 68L28 67z"/>
<path style="fill:#b68a78; stroke:none;" d="M46 67L47 68L46 67z"/>
<path style="fill:#ae8878; stroke:none;" d="M91 67L91 70C91.6961 68.4463 91.6961 68.5537 91 67z"/>
<path style="fill:#a37664; stroke:none;" d="M147 67L148 68L147 67z"/>
<path style="fill:#d7a397; stroke:none;" d="M51 68L52 69L51 68z"/>
<path style="fill:#b28e7b; stroke:none;" d="M120 68L120 71C120.696 69.4463 120.696 69.5537 120 68z"/>
<path style="fill:#a57868; stroke:none;" d="M142 68L143 69L142 68z"/>
<path style="fill:#aa7d75; stroke:none;" d="M149 68L150 69L149 68z"/>
<path style="fill:#d7a693; stroke:none;" d="M68 69L69 70L68 69z"/>
<path style="fill:#f4ceb6; stroke:none;" d="M73 69L74 70L73 69z"/>
<path style="fill:#eec7b4; stroke:none;" d="M116 69L116 72C116.696 70.4463 116.696 70.5537 116 69z"/>
<path style="fill:#723a24; stroke:none;" d="M119 69L119 77C120.161 74.2302 120.161 71.7698 119 69z"/>
<path style="fill:#ddc6b6; stroke:none;" d="M137 69L138 70L137 69z"/>
<path style="fill:#e1bbab; stroke:none;" d="M142 69L143 70L142 69z"/>
<path style="fill:#b38c78; stroke:none;" d="M151 69L152 70L151 69z"/>
<path style="fill:#c29886; stroke:none;" d="M26 70L27 71L26 70z"/>
<path style="fill:#e4c7b7; stroke:none;" d="M47 70L48 71L47 70z"/>
<path style="fill:#e5c5b8; stroke:none;" d="M91 70L91 73C91.6961 71.4463 91.6961 71.5537 91 70z"/>
<path style="fill:#88614b; stroke:none;" d="M137.333 70.6667C137.278 70.7222 137.222 71.7778 137.667 71.3333C137.722 71.2778 137.778 70.2222 137.333 70.6667z"/>
<path style="fill:#9b7864; stroke:none;" d="M153 70L154 71L153 70z"/>
<path style="fill:#d1a396; stroke:none;" d="M160 70L161 71L160 70z"/>
<path style="fill:#e8c5b2; stroke:none;" d="M20 71L21 72L20 71z"/>
<path style="fill:#ceae9f; stroke:none;" d="M52 71L53 72L52 71z"/>
<path style="fill:#ecc5b4; stroke:none;" d="M95 71L95 74C95.6961 72.4463 95.6961 72.5537 95 71z"/>
<path style="fill:#e3c7b9; stroke:none;" d="M120 71L120 74C120.696 72.4463 120.696 72.5537 120 71z"/>
<path style="fill:#cfaa93; stroke:none;" d="M154 71L155 72L154 71z"/>
<path style="fill:#d0a697; stroke:none;" d="M162 71L163 72L162 71z"/>
<path style="fill:#bc978b; stroke:none;" d="M20 72L21 73L20 72z"/>
<path style="fill:#a4735a; stroke:none;" d="M27 72L28 73L27 72z"/>
<path style="fill:#b98571; stroke:none;" d="M48 72L49 73L48 72z"/>
<path style="fill:#bea492; stroke:none;" d="M69.3333 72.6667C69.2778 72.7222 69.2222 73.7778 69.6667 73.3333C69.7223 73.2777 69.7777 72.2223 69.3333 72.6667z"/>
<path style="fill:#bc8c76; stroke:none;" d="M116 72L116 75C116.696 73.4463 116.696 73.5537 116 72z"/>
<path style="fill:#cea992; stroke:none;" d="M141 72L142 73L141 72z"/>
<path style="fill:#ecc5b5; stroke:none;" d="M164 72L165 73L164 72z"/>
<path style="fill:#eacdc0; stroke:none;" d="M28 73L29 74L28 73z"/>
<path style="fill:#debfac; stroke:none;" d="M74 73L75 74L74 73z"/>
<path style="fill:#edc6b5; stroke:none;" d="M136 73L137 74L136 73z"/>
<path style="fill:#a4806c; stroke:none;" d="M165 73L166 74L165 73z"/>
<path style="fill:#e6cbba; stroke:none;" d="M21 74L22 75L21 74z"/>
<path style="fill:#d3a594; stroke:none;" d="M53 74L54 75L53 74z"/>
<path style="fill:#a47e6b; stroke:none;" d="M74 74L75 75L74 74z"/>
<path style="fill:#be8b76; stroke:none;" d="M95 74L95 77C95.6961 75.4463 95.6961 75.5537 95 74z"/>
<path style="fill:#94624d; stroke:none;" d="M136.333 74.6667C136.278 74.7222 136.222 75.7778 136.667 75.3333C136.722 75.2778 136.778 74.2223 136.333 74.6667z"/>
<path style="fill:#ae8365; stroke:none;" d="M22 75L23 76L22 75z"/>
<path style="fill:#d3a99a; stroke:none;" d="M29 75L30 76L29 75z"/>
<path style="fill:#cdac9a; stroke:none;" d="M49 75L50 76L49 75z"/>
<path style="fill:#a78c75; stroke:none;" d="M140 75L141 76L140 75z"/>
<path style="fill:#b58874; stroke:none;" d="M70.3333 76.6667C70.2778 76.7222 70.2222 77.7778 70.6667 77.3333C70.7223 77.2777 70.7777 76.2223 70.3333 76.6667z"/>
<path style="fill:#dfcab4; stroke:none;" d="M140 76L141 77L140 76z"/>
<path style="fill:#854527; stroke:none;" d="M156 76C153.624 86.3649 150.656 96.8964 147.329 107C145.571 112.342 142.956 117.446 142 123C146.607 120.522 147.425 115.725 149 111C152.471 100.585 155.774 89.7548 158 79C160.123 80.0103 162.126 81.0255 163.961 82.5324C176.292 92.6558 164.118 106.086 158 116C168.411 111.101 171.079 99.3241 171 89C175.505 91.9899 180.105 94.3212 181 100C183.604 93.5606 177.03 91.5872 173.434 87.5355C171.305 85.1376 170.944 81.9493 170 79C169.317 80.506 169.174 81.3148 169 83C167.543 81.8966 167.103 81.4566 166 80C162.406 79.4807 159.126 77.8384 156 76z"/>
<path style="fill:#a47c6a; stroke:none;" d="M168 76L169 77L168 76z"/>
<path style="fill:#e7b9a5; stroke:none;" d="M23 77L24 78L23 77z"/>
<path style="fill:#b49586; stroke:none;" d="M30 77L31 78L30 77z"/>
<path style="fill:#d9bead; stroke:none;" d="M54 77L55 78L54 77z"/>
<path style="fill:#f0c6b4; stroke:none;" d="M75 77L76 78L75 77z"/>
<path style="fill:#eed1be; stroke:none;" d="M135 77L136 78L135 77z"/>
<path style="fill:#e3bfae; stroke:none;" d="M169 77L170 78L169 77z"/>
<path style="fill:#cf9e8a; stroke:none;" d="M50 78L51 79L50 78z"/>
<path style="fill:#efc2af; stroke:none;" d="M70 78L71 79L70 78z"/>
<path style="fill:#b88b7a; stroke:none;" d="M75 78L76 79L75 78z"/>
<path style="fill:#c3a293; stroke:none;" d="M155 78L156 79L155 78z"/>
<path style="fill:#ba8c79; stroke:none;" d="M31 79L32 80L31 79z"/>
<path style="fill:#bb8b76; stroke:none;" d="M92 79L92 82C92.6961 80.4463 92.6961 80.5537 92 79z"/>
<path style="fill:#ca9a84; stroke:none;" d="M139 79L140 80L139 79z"/>
<path style="fill:#ecb799; stroke:none;" d="M158 79L159 80L158 79z"/>
<path style="fill:#bb8a6a; stroke:none;" d="M159 79L160 80L159 79z"/>
<path style="fill:#e7c4b0; stroke:none;" d="M170 79L171 80L170 79z"/>
<path style="fill:#a78e7c; stroke:none;" d="M25 80L26 81L25 80z"/>
<path style="fill:#986c5c; stroke:none;" d="M51 80L52 81L51 80z"/>
<path style="fill:#fcd4c1; stroke:none;" d="M55 80L56 81L55 80z"/>
<path style="fill:#b98974; stroke:none;" d="M119 80L119 83C119.696 81.4463 119.696 81.5537 119 80z"/>
<path style="fill:#b3917d; stroke:none;" d="M161 80L162 81L161 80z"/>
<path style="fill:#b28e7a; stroke:none;" d="M32 81L33 82L32 81z"/>
<path style="fill:#c8a69e; stroke:none;" d="M51 81L52 82L51 81z"/>
<path style="fill:#a37d6d; stroke:none;" d="M71 81L72 82L71 81z"/>
<path style="fill:#793f2b; stroke:none;" d="M72 81C72.2043 85.7472 73.3934 90.3024 74 95C75.641 90.7957 74.0787 84.9029 72 81z"/>
<path style="fill:#d2b6a4; stroke:none;" d="M115.333 81.6667C115.278 81.7222 115.222 82.7778 115.667 82.3333C115.722 82.2778 115.778 81.2223 115.333 81.6667z"/>
<path style="fill:#f8cbb9; stroke:none;" d="M134 81L135 82L134 81z"/>
<path style="fill:#d1a58d; stroke:none;" d="M154 81L155 82L154 81z"/>
<path style="fill:#a56d60; stroke:none;" d="M157 81L158 82L157 81z"/>
<path style="fill:#deb6a4; stroke:none;" d="M26 82L27 83L26 82z"/>
<path style="fill:#d5afa1; stroke:none;" d="M71 82L72 83L71 82z"/>
<path style="fill:#9b7463; stroke:none;" d="M76.3333 82.6667C76.2778 82.7222 76.2222 83.7778 76.6667 83.3333C76.7222 83.2778 76.7778 82.2222 76.3333 82.6667z"/>
<path style="fill:#f0c8b4; stroke:none;" d="M92 82L92 85C92.6961 83.4463 92.6961 83.5537 92 82z"/>
<path style="fill:#703723; stroke:none;" d="M118 82L118 90C119.161 87.2301 119.161 84.7699 118 82z"/>
<path style="fill:#b98c79; stroke:none;" d="M134 82L135 83L134 82z"/>
<path style="fill:#e6b7a6; stroke:none;" d="M157 82L158 83L157 82z"/>
<path style="fill:#b3907d; stroke:none;" d="M164 82L165 83L164 82z"/>
<path style="fill:#b08a79; stroke:none;" d="M33 83L34 84L33 83z"/>
<path style="fill:#6c3a26; stroke:none;" d="M93 83L93 87C93.7102 85.2405 93.7102 84.7595 93 83z"/>
<path style="fill:#dfc6b5; stroke:none;" d="M96 83L96 86C96.6961 84.4463 96.6961 84.5537 96 83z"/>
<path style="fill:#b79781; stroke:none;" d="M115.333 83.6667C115.278 83.7222 115.222 84.7778 115.667 84.3333C115.722 84.2778 115.778 83.2222 115.333 83.6667z"/>
<path style="fill:#e9c0af; stroke:none;" d="M119 83L119 87C119.71 85.2405 119.71 84.7595 119 83z"/>
<path style="fill:#ae8876; stroke:none;" d="M138 83L139 84L138 83z"/>
<path style="fill:#d4b5a3; stroke:none;" d="M165 83L166 84L165 83z"/>
<path style="fill:#f1c6b1; stroke:none;" d="M171 83L172 84L171 83z"/>
<path style="fill:#e8c7b8; stroke:none;" d="M27 84L28 85L27 84z"/>
<path style="fill:#ca9a86; stroke:none;" d="M52 84L53 85L52 84z"/>
<path style="fill:#cfafa0; stroke:none;" d="M56 84L57 85L56 84z"/>
<path style="fill:#eccbbc; stroke:none;" d="M138 84L139 85L138 84z"/>
<path style="fill:#d3b6a6; stroke:none;" d="M153 84L154 85L153 84z"/>
<path style="fill:#cea793; stroke:none;" d="M166 84L167 85L166 84z"/>
<path style="fill:#be8c77; stroke:none;" d="M171.333 84.6667C171.278 84.7223 171.222 85.7778 171.667 85.3333C171.722 85.2778 171.778 84.2222 171.333 84.6667z"/>
<path style="fill:#c5aa94; stroke:none;" d="M34 85L35 86L34 85z"/>
<path style="fill:#9d7764; stroke:none;" d="M153 85L154 86L153 85z"/>
<path style="fill:#c9a899; stroke:none;" d="M156 85L157 86L156 85z"/>
<path style="fill:#ab8069; stroke:none;" d="M167 85L168 86L167 85z"/>
<path style="fill:#dcb3a1; stroke:none;" d="M72.3333 86.6667C72.2778 86.7222 72.2222 87.7778 72.6667 87.3333C72.7222 87.2778 72.7778 86.2222 72.3333 86.6667z"/>
<path style="fill:#edc5ae; stroke:none;" d="M77 86L78 87L77 86z"/>
<path style="fill:#b5917d; stroke:none;" d="M96 86L96 89C96.6961 87.4463 96.6961 87.5537 96 86z"/>
<path style="fill:#a37d6a; stroke:none;" d="M133.333 86.6667C133.278 86.7223 133.222 87.7777 133.667 87.3333C133.722 87.2778 133.778 86.2222 133.333 86.6667z"/>
<path style="fill:#b78169; stroke:none;" d="M137.333 86.6667C137.278 86.7223 137.222 87.7778 137.667 87.3333C137.722 87.2778 137.778 86.2222 137.333 86.6667z"/>
<path style="fill:#e9c7b3; stroke:none;" d="M35 87L36 88L35 87z"/>
<path style="fill:#a1786a; stroke:none;" d="M53 87L54 88L53 87z"/>
<path style="fill:#9c674f; stroke:none;" d="M77.3333 87.6667C77.2778 87.7222 77.2222 88.7778 77.6667 88.3333C77.7222 88.2778 77.7778 87.2222 77.3333 87.6667z"/>
<path style="fill:#895e4c; stroke:none;" d="M93 87L93 90C93.6961 88.4463 93.6961 88.5537 93 87z"/>
<path style="fill:#f0c3b2; stroke:none;" d="M168 87L169 88L168 87z"/>
<path style="fill:#a17a6e; stroke:none;" d="M172 87L173 88L172 87z"/>
<path style="fill:#a3745f; stroke:none;" d="M35 88L36 89L35 88z"/>
<path style="fill:#d2b5aa; stroke:none;" d="M53 88L54 89L53 88z"/>
<path style="fill:#95644c; stroke:none;" d="M57.3333 88.6667C57.2778 88.7222 57.2222 89.7778 57.6667 89.3333C57.7222 89.2778 57.7778 88.2222 57.3333 88.6667z"/>
<path style="fill:#e5b59f; stroke:none;" d="M137 88L138 89L137 88z"/>
<path style="fill:#b98872; stroke:none;" d="M152 88L153 89L152 88z"/>
<path style="fill:#aa7f6a; stroke:none;" d="M155 88L156 89L155 88z"/>
<path style="fill:#a57363; stroke:none;" d="M30 89L31 90L30 89z"/>
<path style="fill:#8b604e; stroke:none;" d="M96 89L96 92C96.6961 90.4463 96.6961 90.5537 96 89z"/>
<path style="fill:#f0cdbc; stroke:none;" d="M155 89L156 90L155 89z"/>
<path style="fill:#9e796a; stroke:none;" d="M169 89L170 90L169 89z"/>
<path style="fill:#91492a; stroke:none;" d="M171 89C171.028 96.8983 174.38 99.2774 182 101C180.359 94.9832 177.126 93.2629 173 89L171 89z"/>
<path style="fill:#eccabb; stroke:none;" d="M175 89L176 90L175 89z"/>
<path style="fill:#b1927e; stroke:none;" d="M36 90L37 91L36 90z"/>
<path style="fill:#ae9284; stroke:none;" d="M93.3333 90.6667C93.2778 90.7222 93.2222 91.7778 93.6667 91.3333C93.7222 91.2778 93.7778 90.2222 93.3333 90.6667z"/>
<path style="fill:#ecc4b0; stroke:none;" d="M114 90L114 93C114.696 91.4463 114.696 91.5537 114 90z"/>
<path style="fill:#efc2b2; stroke:none;" d="M132 90L133 91L132 90z"/>
<path style="fill:#e4cab7; stroke:none;" d="M169 90L169 95C169.83 92.9695 169.83 92.0305 169 90z"/>
<path style="fill:#a97f6a; stroke:none;" d="M176 90L177 91L176 90z"/>
<path style="fill:#9f7362; stroke:none;" d="M31 91L32 92L31 91z"/>
<path style="fill:#b78976; stroke:none;" d="M54 91L55 92L54 91z"/>
<path style="fill:#d2b5a7; stroke:none;" d="M58 91L59 92L58 91z"/>
<path style="fill:#af8a7a; stroke:none;" d="M73 91L74 92L73 91z"/>
<path style="fill:#eccfc1; stroke:none;" d="M78 91L79 92L78 91z"/>
<path style="fill:#bc8a75; stroke:none;" d="M132 91L133 92L132 91z"/>
<path style="fill:#e1beaa; stroke:none;" d="M151 91L152 92L151 91z"/>
<path style="fill:#e8c6b3; stroke:none;" d="M178 91L179 92L178 91z"/>
<path style="fill:#e9cac0; stroke:none;" d="M31 92L32 93L31 92z"/>
<path style="fill:#f4cbb8; stroke:none;" d="M37 92L38 93L37 92z"/>
<path style="fill:#f0c8b5; stroke:none;" d="M54 92L55 93L54 92z"/>
<path style="fill:#d4b8aa; stroke:none;" d="M73 92L74 93L73 92z"/>
<path style="fill:#96735f; stroke:none;" d="M78 92L78 95C78.6961 93.4463 78.6961 93.5537 78 92z"/>
<path style="fill:#e8cec4; stroke:none;" d="M93 92L93 95C93.6961 93.4463 93.6961 93.5537 93 92z"/>
<path style="fill:#75412a; stroke:none;" d="M96 92C95.9965 97.3539 94.8596 102.755 96 108C97.8123 103.681 97.8123 96.3189 96 92z"/>
<path style="fill:#b39387; stroke:none;" d="M136 92L137 93L136 92z"/>
<path style="fill:#a77a67; stroke:none;" d="M151 92L152 93L151 92z"/>
<path style="fill:#bb9e91; stroke:none;" d="M154 92L155 93L154 92z"/>
<path style="fill:#a77f6d; stroke:none;" d="M179 92L180 93L179 92z"/>
<path style="fill:#bf8d79; stroke:none;" d="M114.333 93.6667C114.278 93.7222 114.222 94.7778 114.667 94.3333C114.722 94.2778 114.778 93.2222 114.333 93.6667z"/>
<path style="fill:#b48e7c; stroke:none;" d="M118 93L118 96C118.696 94.4463 118.696 94.5537 118 93z"/>
<path style="fill:#e1c7bf; stroke:none;" d="M136 93L137 94L136 93z"/>
<path style="fill:#e8ccc0; stroke:none;" d="M181 93L182 94L181 93z"/>
<path style="fill:#deb6a3; stroke:none;" d="M32 94L33 95L32 94z"/>
<path style="fill:#efd0bf; stroke:none;" d="M182 94L183 95L182 94z"/>
<path style="fill:#c9a497; stroke:none;" d="M38 95L39 96L38 95z"/>
<path style="fill:#bf9b88; stroke:none;" d="M55 95L56 96L55 95z"/>
<path style="fill:#bb8f7a; stroke:none;" d="M59.3333 95.6667C59.2778 95.7222 59.2222 96.7778 59.6667 96.3333C59.7223 96.2777 59.7778 95.2222 59.3333 95.6667z"/>
<path style="fill:#915e47; stroke:none;" d="M114 95L114 99C114.71 97.2405 114.71 96.7595 114 95z"/>
<path style="fill:#d1b0a4; stroke:none;" d="M131 95L132 96L131 95z"/>
<path style="fill:#d4a799; stroke:none;" d="M150 95L151 96L150 95z"/>
<path style="fill:#b07e66; stroke:none;" d="M153 95L154 96L153 95z"/>
<path style="fill:#aa8d7a; stroke:none;" d="M182.333 95.6667C182.278 95.7222 182.222 96.7778 182.667 96.3333C182.722 96.2778 182.778 95.2222 182.333 95.6667z"/>
<path style="fill:#be9d8f; stroke:none;" d="M33 96L34 97L33 96z"/>
<path style="fill:#cc9a8a; stroke:none;" d="M74 96L74 99C74.6961 97.4463 74.6961 97.5537 74 96z"/>
<path style="fill:#e0c6be; stroke:none;" d="M118 96L118 99C118.696 97.4463 118.696 97.5537 118 96z"/>
<path style="fill:#c39684; stroke:none;" d="M135.333 96.6667C135.278 96.7223 135.222 97.7778 135.667 97.3333C135.722 97.2778 135.778 96.2222 135.333 96.6667z"/>
<path style="fill:#a06e56; stroke:none;" d="M150 96L151 97L150 96z"/>
<path style="fill:#deb6a6; stroke:none;" d="M153 96L154 97L153 96z"/>
<path style="fill:#eec0ac; stroke:none;" d="M79 97L80 98L79 97z"/>
<path style="fill:#f1caba; stroke:none;" d="M97 97L97 104C98.0595 101.466 98.0595 99.5343 97 97z"/>
<path style="fill:#f8ddd2; stroke:none;" d="M182.333 97.6667C182.278 97.7222 182.222 98.7778 182.667 98.3333C182.722 98.2778 182.778 97.2222 182.333 97.6667z"/>
<path style="fill:#a87860; stroke:none;" d="M34 98L35 99L34 98z"/>
<path style="fill:#d1a69b; stroke:none;" d="M39 98L40 99L39 98z"/>
<path style="fill:#a57360; stroke:none;" d="M79.3333 98.6667C79.2778 98.7222 79.2222 99.7778 79.6667 99.3333C79.7222 99.2778 79.7778 98.2222 79.3333 98.6667z"/>
<path style="fill:#f2c8b8; stroke:none;" d="M135 98L136 99L135 98z"/>
<path style="fill:#ce9e87; stroke:none;" d="M168 98L169 99L168 98z"/>
<path style="fill:#d9af98; stroke:none;" d="M171 98L172 99L171 98z"/>
<path style="fill:#a68471; stroke:none;" d="M173 98L174 99L173 98z"/>
<path style="fill:#784427; stroke:none;" d="M174 98C176.372 100.952 178.012 103.308 179 107C180.225 104.987 180.645 103.341 181 101C178.672 99.8172 176.489 98.7771 174 98z"/>
<path style="fill:#f8cdbc; stroke:none;" d="M34 99L35 100L34 99z"/>
<path style="fill:#c2927c; stroke:none;" d="M56 99L57 100L56 99z"/>
<path style="fill:#e9d2c6; stroke:none;" d="M60 99L61 100L60 99z"/>
<path style="fill:#b98772; stroke:none;" d="M94 99L94 102C94.6961 100.446 94.6961 100.554 94 99z"/>
<path style="fill:#d2ad96; stroke:none;" d="M130.333 99.6667C130.278 99.7222 130.222 100.778 130.667 100.333C130.722 100.278 130.778 99.2222 130.333 99.6667z"/>
<path style="fill:#ad8d7f; stroke:none;" d="M149 99L150 100L149 99z"/>
<path style="fill:#b38d7b; stroke:none;" d="M152 99L153 100L152 99z"/>
<path style="fill:#edcbb6; stroke:none;" d="M174 99L175 100L174 99z"/>
<path style="fill:#8f6953; stroke:none;" d="M60.3333 100.667C60.2778 100.722 60.2222 101.778 60.6667 101.333C60.7223 101.278 60.7778 100.222 60.3333 100.667z"/>
<path style="fill:#e3b6ab; stroke:none;" d="M167 100L168 101L167 100z"/>
<path style="fill:#c7ae98; stroke:none;" d="M170 100L171 101L170 100z"/>
<path style="fill:#b68f7c; stroke:none;" d="M176 100L177 101L176 100z"/>
<path style="fill:#cba494; stroke:none;" d="M35 101L36 102L35 101z"/>
<path style="fill:#debca9; stroke:none;" d="M40 101L41 102L40 101z"/>
<path style="fill:#743924; stroke:none;" d="M79 101L79 105C79.7102 103.241 79.7102 102.759 79 101z"/>
<path style="fill:#9d7564; stroke:none;" d="M134 101L135 102L134 101z"/>
<path style="fill:#ba8774; stroke:none;" d="M181 101L182 102L181 101z"/>
<path style="fill:#a0735d; stroke:none;" d="M40 102L41 103L40 102z"/>
<path style="fill:#c3a694; stroke:none;" d="M75 102L75 105C75.6961 103.446 75.6961 103.554 75 102z"/>
<path style="fill:#efc7b6; stroke:none;" d="M94.3333 102.667C94.2778 102.722 94.2222 103.778 94.6667 103.333C94.7222 103.278 94.7778 102.222 94.3333 102.667z"/>
<path style="fill:#dac3b8; stroke:none;" d="M134.333 102.667C134.278 102.722 134.222 103.778 134.667 103.333C134.722 103.278 134.778 102.222 134.333 102.667z"/>
<path style="fill:#cea793; stroke:none;" d="M148 102L149 103L148 102z"/>
<path style="fill:#f0bdad; stroke:none;" d="M166 102L167 103L166 102z"/>
<path style="fill:#e7c5af; stroke:none;" d="M169 102L170 103L169 102z"/>
<path style="fill:#efc7b6; stroke:none;" d="M181 102L182 103L181 102z"/>
<path style="fill:#a6735e; stroke:none;" d="M36 103L37 104L36 103z"/>
<path style="fill:#ae8b77; stroke:none;" d="M57 103L58 104L57 103z"/>
<path style="fill:#e8cbbd; stroke:none;" d="M80 103L81 104L80 103z"/>
<path style="fill:#a4735b; stroke:none;" d="M148 103L149 104L148 103z"/>
<path style="fill:#d3a795; stroke:none;" d="M151 103L152 104L151 103z"/>
<path style="fill:#cda58d; stroke:none;" d="M178 103L179 104L178 103z"/>
<path style="fill:#dbb19f; stroke:none;" d="M36 104L37 105L36 104z"/>
<path style="fill:#ffd1c1; stroke:none;" d="M41 104L42 105L41 104z"/>
<path style="fill:#e0c3b3; stroke:none;" d="M57 104L58 105L57 104z"/>
<path style="fill:#d7ac94; stroke:none;" d="M61 104L62 105L61 104z"/>
<path style="fill:#b58d7c; stroke:none;" d="M80.3333 104.667C80.2778 104.722 80.2222 105.778 80.6667 105.333C80.7222 105.278 80.7778 104.222 80.3333 104.667z"/>
<path style="fill:#c5a095; stroke:none;" d="M129.333 104.667C129.278 104.722 129.222 105.778 129.667 105.333C129.722 105.278 129.778 104.222 129.333 104.667z"/>
<path style="fill:#c9a899; stroke:none;" d="M165 104L166 105L165 104z"/>
<path style="fill:#e3c5b5; stroke:none;" d="M168 104L169 105L168 104z"/>
<path style="fill:#967665; stroke:none;" d="M180 104L181 105L180 104z"/>
<path style="fill:#bf8c7b; stroke:none;" d="M41 105L42 106L41 105z"/>
<path style="fill:#ba8772; stroke:none;" d="M117 105L117 108C117.696 106.446 117.696 106.554 117 105z"/>
<path style="fill:#a0705c; stroke:none;" d="M167 105L168 106L167 105z"/>
<path style="fill:#8c4a27; stroke:none;" d="M177 105C170.644 113.575 157.64 123.181 156 134C159.934 132.801 162.184 129.94 165 126.999C170.932 120.804 178.083 113.903 179 105L177 105z"/>
<path style="fill:#cdb6a7; stroke:none;" d="M180 105L181 106L180 105z"/>
<path style="fill:#7e5a49; stroke:none;" d="M95 106L96 112C96.8888 109.492 96.495 108.185 95 106z"/>
<path style="fill:#c19a86; stroke:none;" d="M133.333 106.667C133.278 106.722 133.222 107.778 133.667 107.333C133.722 107.278 133.778 106.222 133.333 106.667z"/>
<path style="fill:#a5816f; stroke:none;" d="M147 106L148 107L147 106z"/>
<path style="fill:#bc9b88; stroke:none;" d="M150 106L151 107L150 106z"/>
<path style="fill:#ad7961; stroke:none;" d="M164 106L165 107L164 106z"/>
<path style="fill:#d0bca8; stroke:none;" d="M37 107L38 108L37 107z"/>
<path style="fill:#ae7d6e; stroke:none;" d="M58 107L59 108L58 107z"/>
<path style="fill:#925f48; stroke:none;" d="M76 107L76 110C76.6961 108.446 76.6961 108.554 76 107z"/>
<path style="fill:#bc9485; stroke:none;" d="M166 107L167 108L166 107z"/>
<path style="fill:#a37c69; stroke:none;" d="M175 107L176 108L175 107z"/>
<path style="fill:#b9896d; stroke:none;" d="M179 107L180 108L179 107z"/>
<path style="fill:#dcbda9; stroke:none;" d="M42 108L43 109L42 108z"/>
<path style="fill:#dfb4a9; stroke:none;" d="M58 108L59 109L58 108z"/>
<path style="fill:#d8b8a9; stroke:none;" d="M62 108L63 109L62 108z"/>
<path style="fill:#6d3922; stroke:none;" d="M116 108L115 113C116.879 111.377 116.916 110.3 116 108z"/>
<path style="fill:#f2c6b4; stroke:none;" d="M117 108L117 111C117.696 109.446 117.696 109.554 117 108z"/>
<path style="fill:#673a27; stroke:none;" d="M129 108L129 112C129.71 110.241 129.71 109.759 129 108z"/>
<path style="fill:#ebc8b4; stroke:none;" d="M133 108L134 109L133 108z"/>
<path style="fill:#cbad93; stroke:none;" d="M174 108L175 109L174 108z"/>
<path style="fill:#a87a69; stroke:none;" d="M38 109L39 110L38 109z"/>
<path style="fill:#8f6956; stroke:none;" d="M62.3333 109.667C62.2778 109.722 62.2222 110.778 62.6667 110.333C62.7222 110.278 62.7778 109.222 62.3333 109.667z"/>
<path style="fill:#ad8e82; stroke:none;" d="M95.3333 109.667C95.2778 109.722 95.2222 110.778 95.6667 110.333C95.7222 110.278 95.7778 109.222 95.3333 109.667z"/>
<path style="fill:#cb9f8a; stroke:none;" d="M114 109L114 112C114.696 110.446 114.696 110.554 114 109z"/>
<path style="fill:#c89687; stroke:none;" d="M146 109L147 110L146 109z"/>
<path style="fill:#ad8065; stroke:none;" d="M149 109L150 110L149 109z"/>
<path style="fill:#b78876; stroke:none;" d="M162 109L163 110L162 109z"/>
<path style="fill:#eec6b6; stroke:none;" d="M165 109L166 110L165 109z"/>
<path style="fill:#b48d7a; stroke:none;" d="M178 109L179 110L178 109z"/>
<path style="fill:#d7b0a0; stroke:none;" d="M38 110L39 111L38 110z"/>
<path style="fill:#d6a58f; stroke:none;" d="M76 110L77 111L76 110z"/>
<path style="fill:#d8b1a3; stroke:none;" d="M81.3333 110.667C81.2778 110.722 81.2222 111.778 81.6667 111.333C81.7222 111.278 81.7778 110.222 81.3333 110.667z"/>
<path style="fill:#a57465; stroke:none;" d="M59 111L60 112L59 111z"/>
<path style="fill:#d6bcb6; stroke:none;" d="M95 111L95 113L97 113C96.4549 111.365 96.6352 111.545 95 111z"/>
<path style="fill:#bc9787; stroke:none;" d="M132.333 111.667C132.278 111.722 132.222 112.778 132.667 112.333C132.722 112.278 132.778 111.222 132.333 111.667z"/>
<path style="fill:#c6a08f; stroke:none;" d="M177 111L178 112L177 111z"/>
<path style="fill:#e6b4a5; stroke:none;" d="M43 112L44 113L43 112z"/>
<path style="fill:#cda699; stroke:none;" d="M59 112L60 113L59 112z"/>
<path style="fill:#c2a091; stroke:none;" d="M77 112L78 113L77 112z"/>
<path style="fill:#ab887b; stroke:none;" d="M81 112L82 113L81 112z"/>
<path style="fill:#bc9e8c; stroke:none;" d="M145 112L146 113L145 112z"/>
<path style="fill:#a3816c; stroke:none;" d="M148 112L149 113L148 112z"/>
<path style="fill:#b7856f; stroke:none;" d="M160 112L161 113L160 112z"/>
<path style="fill:#bc9688; stroke:none;" d="M163 112L164 113L163 112z"/>
<path style="fill:#a47264; stroke:none;" d="M171 112L172 113L171 112z"/>
<path style="fill:#cbae9e; stroke:none;" d="M39 113L40 114L39 113z"/>
<path style="fill:#814227; stroke:none;" d="M43 113L43 118L42 116C40.5979 119.92 42.481 124.042 43.338 128C44.7692 134.611 45.6852 141.304 46.5756 148C47.0401 151.493 46.235 155.584 49 158C45.8915 143.711 49.5826 126.697 43 113z"/>
<path style="fill:#edc3b4; stroke:none;" d="M63 113L64 114L63 113z"/>
<path style="fill:#aa8a80; stroke:none;" d="M79.6667 113.333C79.2222 113.778 80.2778 113.722 80.3333 113.667C80.7778 113.222 79.7222 113.278 79.6667 113.333z"/>
<path style="fill:#d6bbb1; stroke:none;" d="M81 113L82 114L81 113z"/>
<path style="fill:#e4dcd9; stroke:none;" d="M95.6667 113.333C95.2222 113.778 96.2778 113.722 96.3333 113.667C96.7778 113.222 95.7222 113.278 95.6667 113.333z"/>
<path style="fill:#786156; stroke:none;" d="M115 113L116 116C116.685 114.752 116.749 114.452 117 113L115 113z"/>
<path style="fill:#d8baa9; stroke:none;" d="M129 113L130 114L129 113z"/>
<path style="fill:#e3c9bc; stroke:none;" d="M132 113L133 114L132 113z"/>
<path style="fill:#cea795; stroke:none;" d="M159 113L160 114L159 113z"/>
<path style="fill:#9d7365; stroke:none;" d="M162 113L163 114L162 113z"/>
<path style="fill:#a97b6b; stroke:none;" d="M170 113L171 114L170 113z"/>
<path style="fill:#be8b79; stroke:none;" d="M63.3333 114.667C63.2778 114.722 63.2222 115.778 63.6667 115.333C63.7222 115.278 63.7778 114.222 63.3333 114.667z"/>
<path style="fill:#c3a99c; stroke:none;" d="M115 114L116 115L115 114z"/>
<path style="fill:#9c7a63; stroke:none;" d="M130 114L131 115L130 114z"/>
<path style="fill:#dbaf9d; stroke:none;" d="M158 114L159 115L158 114z"/>
<path style="fill:#a07863; stroke:none;" d="M161 114L162 115L161 114z"/>
<path style="fill:#d5b0a5; stroke:none;" d="M169 114L170 115L169 114z"/>
<path style="fill:#b08977; stroke:none;" d="M175 114L176 115L175 114z"/>
<path style="fill:#b4a08f; stroke:none;" d="M131 115L132 116L131 115z"/>
<path style="fill:#a97664; stroke:none;" d="M147 115L148 116L147 115z"/>
<path style="fill:#c59c8c; stroke:none;" d="M160 115L161 116L160 115z"/>
<path style="fill:#b17e6c; stroke:none;" d="M40 116L41 117L40 116z"/>
<path style="fill:#bc9a89; stroke:none;" d="M44.3333 116.667C44.2778 116.722 44.2222 117.778 44.6667 117.333C44.7222 117.278 44.7778 116.222 44.3333 116.667z"/>
<path style="fill:#be9683; stroke:none;" d="M60 116L61 117L60 116z"/>
<path style="fill:#955e41; stroke:none;" d="M63 116L63 124C64.1614 121.23 64.1614 118.77 63 116z"/>
<path style="fill:#efcab6; stroke:none;" d="M147 116L148 117L147 116z"/>
<path style="fill:#f1c2b2; stroke:none;" d="M40 117L41 118L40 117z"/>
<path style="fill:#e8c5b3; stroke:none;" d="M60 117L61 118L60 117z"/>
<path style="fill:#c8ab9b; stroke:none;" d="M143 117L144 118L143 117z"/>
<path style="fill:#efc6b4; stroke:none;" d="M173 117L174 118L173 117z"/>
<path style="fill:#9c7861; stroke:none;" d="M146 118L147 119L146 118z"/>
<path style="fill:#cea59c; stroke:none;" d="M172 118L173 119L172 118z"/>
<path style="fill:#af836b; stroke:none;" d="M142 119L143 120L142 119z"/>
<path style="fill:#e1c6b2; stroke:none;" d="M146 119L147 120L146 119z"/>
<path style="fill:#a27161; stroke:none;" d="M171 119L172 120L171 119z"/>
<path style="fill:#ae8b78; stroke:none;" d="M41 120L42 121L41 120z"/>
<path style="fill:#b0917f; stroke:none;" d="M61 120L62 121L61 120z"/>
<path style="fill:#bb8d79; stroke:none;" d="M164 120L165 121L164 120z"/>
<path style="fill:#9c7569; stroke:none;" d="M170 120L171 121L170 120z"/>
<path style="fill:#e2c8b7; stroke:none;" d="M41 121L42 122L41 121z"/>
<path style="fill:#f0c4af; stroke:none;" d="M45 121L46 122L45 121z"/>
<path style="fill:#dcc6b6; stroke:none;" d="M61 121L62 122L61 121z"/>
<path style="fill:#d2bfb4; stroke:none;" d="M141 121L142 122L141 121z"/>
<path style="fill:#cca697; stroke:none;" d="M163 121L164 122L163 121z"/>
<path style="fill:#aa745c; stroke:none;" d="M45.3333 122.667C45.2778 122.722 45.2222 123.778 45.6667 123.333C45.7222 123.278 45.7778 122.222 45.3333 122.667z"/>
<path style="fill:#eecfc1; stroke:none;" d="M144 122L145 123L144 122z"/>
<path style="fill:#b88f7e; stroke:none;" d="M42 124L43 125L42 124z"/>
<path style="fill:#ae8f82; stroke:none;" d="M62 124L62 126L64 126L64 124L62 124z"/>
<path style="fill:#e1bbad; stroke:none;" d="M42 125L43 126L42 125z"/>
<path style="fill:#f1dccb; stroke:none;" d="M62.6667 126.333C62.2222 126.778 63.2778 126.722 63.3333 126.667C63.7777 126.222 62.7222 126.278 62.6667 126.333z"/>
<path style="fill:#a07560; stroke:none;" d="M159 126L160 127L159 126z"/>
<path style="fill:#d7b5ac; stroke:none;" d="M46 127L47 128L46 127z"/>
<path style="fill:#c39780; stroke:none;" d="M158 127L159 128L158 127z"/>
<path style="fill:#ad8d7f; stroke:none;" d="M43.3333 128.667C43.2778 128.722 43.2222 129.778 43.6667 129.333C43.7222 129.278 43.7778 128.222 43.3333 128.667z"/>
<path style="fill:#9c7063; stroke:none;" d="M46 128L46 131C46.6961 129.446 46.6961 129.554 46 128z"/>
<path style="fill:#d9b3a1; stroke:none;" d="M157 128L158 129L157 128z"/>
<path style="fill:#efcec0; stroke:none;" d="M156 129L157 130L156 129z"/>
<path style="fill:#c9a292; stroke:none;" d="M162 129L163 130L162 129z"/>
<path style="fill:#dec2b4; stroke:none;" d="M43 130L44 131L43 130z"/>
<path style="fill:#d4a797; stroke:none;" d="M161 130L162 131L161 130z"/>
<path style="fill:#a87b6b; stroke:none;" d="M160 131L161 132L160 131z"/>
<path style="fill:#d1a38f; stroke:none;" d="M47 133L47 136C47.6961 134.446 47.6961 134.554 47 133z"/>
<path style="fill:#cea290; stroke:none;" d="M44 134L44 137C44.6961 135.446 44.6961 135.554 44 134z"/>
<path style="fill:#5e371f; stroke:none;" d="M156 134L156 137C157.015 135.861 157.309 135.388 158 134L156 134z"/>
<path style="fill:#c49f8f; stroke:none;" d="M80.6667 135.333C80.2222 135.778 81.2778 135.722 81.3333 135.667C81.7778 135.222 80.7222 135.278 80.6667 135.333z"/>
<path style="fill:#9e7865; stroke:none;" d="M82.6667 135.333C82.2222 135.778 83.2778 135.722 83.3333 135.667C83.7778 135.222 82.7222 135.278 82.6667 135.333z"/>
<path style="fill:#87604d; stroke:none;" d="M84 135C85.2484 135.685 85.5484 135.749 87 136C85.7517 135.315 85.4516 135.251 84 135z"/>
<path style="fill:#663c29; stroke:none;" d="M87 135C90.1633 136.327 93.5856 136 97 136C93.8367 134.673 90.4144 135 87 135z"/>
<path style="fill:#8d6252; stroke:none;" d="M97 135C98.2484 135.685 98.5484 135.749 100 136C98.7517 135.315 98.4516 135.251 97 135z"/>
<path style="fill:#ae897e; stroke:none;" d="M100 135C101.248 135.685 101.548 135.749 103 136C101.752 135.315 101.452 135.251 100 135z"/>
<path style="fill:#e0c9bf; stroke:none;" d="M103.667 135.333C103.222 135.778 104.278 135.722 104.333 135.667C104.778 135.222 103.722 135.278 103.667 135.333z"/>
<path style="fill:#bf957f; stroke:none;" d="M157 135L158 136L157 135z"/>
<path style="fill:#e3b6a8; stroke:none;" d="M75 136L76 137L75 136z"/>
<path style="fill:#8f482c; stroke:none;" d="M49 158C58.5846 153.791 65.6814 146.248 76.1698 143.47C90.9917 139.544 107.789 144.251 122 148.586C127.28 150.197 133.02 151.509 138 153.916C141.559 155.636 144.409 158.357 148 160C148.47 157.462 149.251 154.662 148.552 152.093C146.666 145.165 135.76 143.764 130 141.975C111.395 136.194 87.9122 131.74 69 138.696C61.32 141.521 46.2741 148.422 49 158z"/>
<path style="fill:#c09788; stroke:none;" d="M108.667 136.333C108.222 136.778 109.278 136.722 109.333 136.667C109.778 136.222 108.722 136.278 108.667 136.333z"/>
<path style="fill:#f1c5ba; stroke:none;" d="M110 136L111 137L110 136z"/>
<path style="fill:#e3c5bb; stroke:none;" d="M71 137L72 138L71 137z"/>
<path style="fill:#aa8274; stroke:none;" d="M72 137L73 138L72 137z"/>
<path style="fill:#e1c3b9; stroke:none;" d="M114.667 137.333C114.222 137.778 115.278 137.722 115.333 137.667C115.778 137.222 114.722 137.278 114.667 137.333z"/>
<path style="fill:#af7f69; stroke:none;" d="M69 138L70 139L69 138z"/>
<path style="fill:#c09382; stroke:none;" d="M118 138L119 139L118 138z"/>
<path style="fill:#9f7966; stroke:none;" d="M45 139L45 142C45.6961 140.446 45.6961 140.554 45 139z"/>
<path style="fill:#cda99e; stroke:none;" d="M66 139L67 140L66 139z"/>
<path style="fill:#c9ad9d; stroke:none;" d="M122 139L123 140L122 139z"/>
<path style="fill:#d9a696; stroke:none;" d="M64 140L65 141L64 140z"/>
<path style="fill:#c19985; stroke:none;" d="M125 140L126 141L125 140z"/>
<path style="fill:#d5b2a7; stroke:none;" d="M48.3333 141.667C48.2778 141.722 48.2222 142.778 48.6667 142.333C48.7222 142.278 48.7778 141.222 48.3333 141.667z"/>
<path style="fill:#e1c3b1; stroke:none;" d="M62 141L63 142L62 141z"/>
<path style="fill:#a88777; stroke:none;" d="M128 141L129 142L128 141z"/>
<path style="fill:#e3c8b7; stroke:none;" d="M45.3333 142.667C45.2778 142.722 45.2222 143.778 45.6667 143.333C45.7222 143.278 45.7778 142.222 45.3333 142.667z"/>
<path style="fill:#ab806e; stroke:none;" d="M61 142L62 143L61 142z"/>
<path style="fill:#703a22; stroke:none;" d="M84 142C87.6975 143.552 92.0168 143 96 143C92.3025 141.448 87.9832 142 84 142z"/>
<path style="fill:#a4725d; stroke:none;" d="M131 142L132 143L131 142z"/>
<path style="fill:#e4bca9; stroke:none;" d="M132 142L133 143L132 142z"/>
<path style="fill:#b58c7c; stroke:none;" d="M48.3333 143.667C48.2778 143.722 48.2222 144.778 48.6667 144.333C48.7222 144.278 48.7778 143.222 48.3333 143.667z"/>
<path style="fill:#743723; stroke:none;" d="M74 143C75.506 143.683 76.3148 143.826 78 144C76.4939 143.317 75.6852 143.174 74 143z"/>
<path style="fill:#a46854; stroke:none;" d="M78.6667 143.333C78.2222 143.778 79.2778 143.722 79.3333 143.667C79.7778 143.222 78.7222 143.278 78.6667 143.333z"/>
<path style="fill:#bd8f7c; stroke:none;" d="M80.6667 143.333C80.2222 143.778 81.2778 143.722 81.3333 143.667C81.7778 143.222 80.7222 143.278 80.6667 143.333z"/>
<path style="fill:#e9c2af; stroke:none;" d="M82 143C83.2484 143.685 83.5484 143.749 85 144C83.7517 143.315 83.4516 143.251 82 143z"/>
<path style="fill:#eac3b0; stroke:none;" d="M94 143C95.2484 143.685 95.5484 143.749 97 144C95.7516 143.315 95.4516 143.251 94 143z"/>
<path style="fill:#bd8d75; stroke:none;" d="M97 143C98.2484 143.685 98.5484 143.749 100 144C98.7517 143.315 98.4516 143.251 97 143z"/>
<path style="fill:#cfaa9a; stroke:none;" d="M135 143L136 144L135 143z"/>
<path style="fill:#af896d; stroke:none;" d="M58 144L59 145L58 144z"/>
<path style="fill:#a5816d; stroke:none;" d="M74 144L75 145L74 144z"/>
<path style="fill:#d5b4a8; stroke:none;" d="M75 144L76 145L75 144z"/>
<path style="fill:#d7b7a8; stroke:none;" d="M104 144L105 145L104 144z"/>
<path style="fill:#976956; stroke:none;" d="M105.667 144.333C105.222 144.778 106.278 144.722 106.333 144.667C106.778 144.222 105.722 144.278 105.667 144.333z"/>
<path style="fill:#e0b49f; stroke:none;" d="M138 144L139 145L138 144z"/>
<path style="fill:#87614e; stroke:none;" d="M48 145L48 148C48.6961 146.446 48.6961 146.554 48 145z"/>
<path style="fill:#ddb5a1; stroke:none;" d="M71 145L72 146L71 145z"/>
<path style="fill:#f6cdbb; stroke:none;" d="M109 145L110 146L109 145z"/>
<path style="fill:#996753; stroke:none;" d="M110.667 145.333C110.222 145.778 111.278 145.722 111.333 145.667C111.778 145.222 110.722 145.278 110.667 145.333z"/>
<path style="fill:#dcafa1; stroke:none;" d="M55 146L56 147L55 146z"/>
<path style="fill:#a67764; stroke:none;" d="M67 146L68 147L67 146z"/>
<path style="fill:#d1afa1; stroke:none;" d="M68 146L69 147L68 146z"/>
<path style="fill:#caa998; stroke:none;" d="M114 146L115 147L114 146z"/>
<path style="fill:#9b7360; stroke:none;" d="M115 146L116 147L115 146z"/>
<path style="fill:#efc5b5; stroke:none;" d="M143 146L144 147L143 146z"/>
<path style="fill:#a46d55; stroke:none;" d="M46.3333 147.667C46.2778 147.722 46.2222 148.778 46.6667 148.333C46.7222 148.278 46.7778 147.222 46.3333 147.667z"/>
<path style="fill:#9c6d60; stroke:none;" d="M54 147L55 148L54 147z"/>
<path style="fill:#b48672; stroke:none;" d="M65 147L66 148L65 147z"/>
<path style="fill:#c09582; stroke:none;" d="M118 147L119 148L118 147z"/>
<path style="fill:#e9c5b9; stroke:none;" d="M145 147L146 148L145 147z"/>
<path style="fill:#d2a792; stroke:none;" d="M52 148L53 149L52 148z"/>
<path style="fill:#caad9b; stroke:none;" d="M63 148L64 149L63 148z"/>
<path style="fill:#c2a295; stroke:none;" d="M121 148L122 149L121 148z"/>
<path style="fill:#a97c6b; stroke:none;" d="M146 148L147 149L146 148z"/>
<path style="fill:#bf8e78; stroke:none;" d="M46.3333 149.667C46.2778 149.722 46.2222 150.778 46.6667 150.333C46.7222 150.278 46.7778 149.222 46.3333 149.667z"/>
<path style="fill:#d3a790; stroke:none;" d="M50 149L51 150L50 149z"/>
<path style="fill:#b27b6d; stroke:none;" d="M61 149L62 150L61 149z"/>
<path style="fill:#d6ad99; stroke:none;" d="M124 149L125 150L124 149z"/>
<path style="fill:#a6755c; stroke:none;" d="M125 149L126 150L125 149z"/>
<path style="fill:#efc7b8; stroke:none;" d="M60 150L61 151L60 150z"/>
<path style="fill:#9e7765; stroke:none;" d="M148 150L149 151L148 150z"/>
<path style="fill:#f1cab8; stroke:none;" d="M46 151L46 154C46.6961 152.446 46.6961 152.554 46 151z"/>
<path style="fill:#c89f8e; stroke:none;" d="M131 151L132 152L131 151z"/>
<path style="fill:#a57e6b; stroke:none;" d="M57 152L58 153L57 152z"/>
<path style="fill:#c6a99f; stroke:none;" d="M134 152L135 153L134 152z"/>
<path style="fill:#c18f7c; stroke:none;" d="M149.333 152.667C149.278 152.722 149.222 153.778 149.667 153.333C149.722 153.278 149.778 152.222 149.333 152.667z"/>
<path style="fill:#cea693; stroke:none;" d="M56 153L57 154L56 153z"/>
<path style="fill:#a4785f; stroke:none;" d="M137 153L138 154L137 153z"/>
<path style="fill:#f7d2c1; stroke:none;" d="M55 154L56 155L55 154z"/>
<path style="fill:#b78f80; stroke:none;" d="M139 154L140 155L139 154z"/>
<path style="fill:#946453; stroke:none;" d="M149 154L149 157C149.696 155.446 149.696 155.554 149 154z"/>
<path style="fill:#b38072; stroke:none;" d="M141 155L142 156L141 155z"/>
<path style="fill:#d8bbae; stroke:none;" d="M52 156L53 157L52 156z"/>
<path style="fill:#ecc5b1; stroke:none;" d="M83 156C86.9587 157.661 91.7366 157 96 157C92.0413 155.339 87.2634 156 83 156z"/>
<path style="fill:#ead0be; stroke:none;" d="M142 156L143 157L142 156z"/>
<path style="fill:#d2a595; stroke:none;" d="M50 157L51 158L50 157z"/>
<path style="fill:#d0ac98; stroke:none;" d="M72.6667 157.333C72.2222 157.778 73.2778 157.722 73.3333 157.667C73.7778 157.222 72.7222 157.278 72.6667 157.333z"/>
<path style="fill:#a97d66; stroke:none;" d="M74.6667 157.333C74.2223 157.778 75.2778 157.722 75.3333 157.667C75.7778 157.222 74.7222 157.278 74.6667 157.333z"/>
<path style="fill:#8e472b; stroke:none;" d="M59 187C59.5621 183.975 59.9364 181.078 60 178C55.2473 177.152 51.7057 175.045 48 172C58.3872 169.165 68.2167 165.287 79 164.128C94.6436 162.447 111.951 166.453 127 170.371C134.837 172.412 145.868 179.663 148 168C132.051 162.81 117.867 159 101 159L103 158C98.628 156.655 92.6725 158.008 88 158C75.4316 157.98 62.6694 157.236 51.0039 163.135C44.3761 166.487 40.661 174.662 46.2785 180.812C49.5934 184.441 54.3706 185.926 59 187z"/>
<path style="fill:#773d21; stroke:none;" d="M79 157C84.959 159.5 93.5639 158 100 158C94.041 155.5 85.4361 157 79 157z"/>
<path style="fill:#b59083; stroke:none;" d="M103 157C104.248 157.685 104.548 157.749 106 158C104.752 157.315 104.452 157.251 103 157z"/>
<path style="fill:#793b2b; stroke:none;" d="M148 157C147.598 159.806 147.598 162.194 148 165C149.161 162.23 149.161 159.77 148 157z"/>
<path style="fill:#ba8978; stroke:none;" d="M149.333 157.667C149.278 157.722 149.222 158.778 149.667 158.333C149.722 158.278 149.778 157.222 149.333 157.667z"/>
<path style="fill:#b9a194; stroke:none;" d="M47 158L48 159L47 158z"/>
<path style="fill:#f1c8b4; stroke:none;" d="M65 158L66 159L65 158z"/>
<path style="fill:#b58670; stroke:none;" d="M66.6667 158.333C66.2222 158.778 67.2778 158.722 67.3333 158.667C67.7778 158.222 66.7222 158.278 66.6667 158.333z"/>
<path style="fill:#783c28; stroke:none;" d="M101 158C103.89 159.213 106.874 158.998 110 159C107.11 157.787 104.126 158.002 101 158z"/>
<path style="fill:#ae7a65; stroke:none;" d="M110 158C111.248 158.685 111.548 158.749 113 159C111.752 158.315 111.452 158.251 110 158z"/>
<path style="fill:#bd9b8b; stroke:none;" d="M61 159L62 160L61 159z"/>
<path style="fill:#c39d95; stroke:none;" d="M117 159C118.248 159.685 118.548 159.749 120 160C118.752 159.315 118.452 159.251 117 159z"/>
<path style="fill:#f1c1b6; stroke:none;" d="M149.333 159.667C149.278 159.722 149.222 160.778 149.667 160.333C149.722 160.278 149.778 159.222 149.333 159.667z"/>
<path style="fill:#d6aa99; stroke:none;" d="M57 160L58 161L57 160z"/>
<path style="fill:#ab7968; stroke:none;" d="M122 160L123 161L122 160z"/>
<path style="fill:#d4a799; stroke:none;" d="M123 160L124 161L123 160z"/>
<path style="fill:#cb9d8d; stroke:none;" d="M146 160L147 161L146 160z"/>
<path style="fill:#bfa08e; stroke:none;" d="M54 161L55 162L54 161z"/>
<path style="fill:#c29b8b; stroke:none;" d="M127 161L128 162L127 161z"/>
<path style="fill:#ebc5b1; stroke:none;" d="M51 162L52 163L51 162z"/>
<path style="fill:#a4715a; stroke:none;" d="M52 162L53 163L52 162z"/>
<path style="fill:#d2aa92; stroke:none;" d="M131 162L132 163L131 162z"/>
<path style="fill:#bb998c; stroke:none;" d="M147 162L148 163L147 162z"/>
<path style="fill:#e5d0ba; stroke:none;" d="M49 163L50 164L49 163z"/>
<path style="fill:#a7826c; stroke:none;" d="M134 163L135 164L134 163z"/>
<path style="fill:#e4c3b4; stroke:none;" d="M135 163L136 164L135 163z"/>
<path style="fill:#e3d1c5; stroke:none;" d="M147 163L148 164L147 163z"/>
<path style="fill:#ab7e65; stroke:none;" d="M48 164L49 165L48 164z"/>
<path style="fill:#703b25; stroke:none;" d="M75 164C80.959 166.5 89.5639 165 96 165C90.041 162.5 81.4361 164 75 164z"/>
<path style="fill:#a37258; stroke:none;" d="M137 164L138 165L137 164z"/>
<path style="fill:#e1b8a4; stroke:none;" d="M138 164L139 165L138 164z"/>
<path style="fill:#703b23; stroke:none;" d="M67 165C68.769 165.779 70.0359 165.912 72 166C70.231 165.221 68.9641 165.088 67 165z"/>
<path style="fill:#ba8c7a; stroke:none;" d="M74 165C75.2484 165.685 75.5484 165.749 77 166C75.7517 165.315 75.4516 165.251 74 165z"/>
<path style="fill:#e9c4b6; stroke:none;" d="M77 165C78.5061 165.683 79.3148 165.826 81 166C79.494 165.317 78.6852 165.174 77 165z"/>
<path style="fill:#efc8b7; stroke:none;" d="M92 165C93.7691 165.779 95.0359 165.912 97 166C95.231 165.221 93.9641 165.088 92 165z"/>
<path style="fill:#ba8a74; stroke:none;" d="M97 165C98.2484 165.685 98.5484 165.749 100 166C98.7517 165.315 98.4516 165.251 97 165z"/>
<path style="fill:#905f46; stroke:none;" d="M100.667 165.333C100.222 165.778 101.278 165.722 101.333 165.667C101.778 165.222 100.722 165.278 100.667 165.333z"/>
<path style="fill:#a47e6c; stroke:none;" d="M140 165L141 166L140 165z"/>
<path style="fill:#d3b5ab; stroke:none;" d="M141 165L142 166L141 165z"/>
<path style="fill:#a99485; stroke:none;" d="M148.333 165.667C148.278 165.722 148.222 166.778 148.667 166.333C148.722 166.278 148.778 165.222 148.333 165.667z"/>
<path style="fill:#caad9d; stroke:none;" d="M67 166C68.2484 166.685 68.5484 166.749 70 167C68.7516 166.315 68.4516 166.251 67 166z"/>
<path style="fill:#d9b5a2; stroke:none;" d="M105.667 166.333C105.222 166.778 106.278 166.722 106.333 166.667C106.778 166.222 105.722 166.278 105.667 166.333z"/>
<path style="fill:#9d725e; stroke:none;" d="M107 166C108.248 166.685 108.548 166.749 110 167C108.752 166.315 108.452 166.251 107 166z"/>
<path style="fill:#a36f5d; stroke:none;" d="M143 166L144 167L143 166z"/>
<path style="fill:#f0c6b7; stroke:none;" d="M144 166L145 167L144 166z"/>
<path style="fill:#c38f78; stroke:none;" d="M62 167L63 168L62 167z"/>
<path style="fill:#efc3b1; stroke:none;" d="M63 167L64 168L63 167z"/>
<path style="fill:#cda086; stroke:none;" d="M112 167C113.248 167.685 113.548 167.749 115 168C113.752 167.315 113.452 167.251 112 167z"/>
<path style="fill:#c09a8a; stroke:none;" d="M146 167L147 168L146 167z"/>
<path style="fill:#cb9e99; stroke:none;" d="M44 168L45 169L44 168z"/>
<path style="fill:#b18e7a; stroke:none;" d="M58 168L59 169L58 168z"/>
<path style="fill:#e3cab6; stroke:none;" d="M59 168L60 169L59 168z"/>
<path style="fill:#dab9a8; stroke:none;" d="M117.667 168.333C117.222 168.778 118.278 168.722 118.333 168.667C118.778 168.222 117.722 168.278 117.667 168.333z"/>
<path style="fill:#8c5e48; stroke:none;" d="M119.667 168.333C119.222 168.778 120.278 168.722 120.333 168.667C120.778 168.222 119.722 168.278 119.667 168.333z"/>
<path style="fill:#d6a38f; stroke:none;" d="M55 169L56 170L55 169z"/>
<path style="fill:#c89c85; stroke:none;" d="M123 169L124 170L123 169z"/>
<path style="fill:#bc9483; stroke:none;" d="M52 170L53 171L52 170z"/>
<path style="fill:#bb9b92; stroke:none;" d="M127 170L128 171L127 170z"/>
<path style="fill:#a37f6f; stroke:none;" d="M43.3333 171.667C43.2778 171.722 43.2222 172.778 43.6667 172.333C43.7222 172.278 43.7778 171.222 43.3333 171.667z"/>
<path style="fill:#efc6b1; stroke:none;" d="M50 171L51 172L50 171z"/>
<path style="fill:#f3c8bc; stroke:none;" d="M130 171L131 172L130 171z"/>
<path style="fill:#ab7a6b; stroke:none;" d="M131 171L132 172L131 171z"/>
<path style="fill:#d0a187; stroke:none;" d="M147.333 171.667C147.278 171.722 147.222 172.778 147.667 172.333C147.722 172.278 147.778 171.222 147.333 171.667z"/>
<path style="fill:#bc978a; stroke:none;" d="M134 172L135 173L134 172z"/>
<path style="fill:#c79580; stroke:none;" d="M137 173L138 174L137 173z"/>
<path style="fill:#703d2d; stroke:none;" d="M146 173C145.455 174.635 145.635 174.455 144 175C146.033 175.785 146.785 175.033 146 173z"/>
<path style="fill:#e5b9a4; stroke:none;" d="M50 174L51 175L50 174z"/>
<path style="fill:#aa7f6e; stroke:none;" d="M140 174L141 175L140 174z"/>
<path style="fill:#ebcbb7; stroke:none;" d="M52 175L53 176L52 175z"/>
<path style="fill:#e5bba9; stroke:none;" d="M142 175L143 176L142 175z"/>
<path style="fill:#c39d8c; stroke:none;" d="M43 176L44 177L43 176z"/>
<path style="fill:#d7a595; stroke:none;" d="M54 176L55 177L54 176z"/>
<path style="fill:#b2a199; stroke:none;" d="M145.667 176.333C145.222 176.778 146.278 176.722 146.333 176.667C146.778 176.222 145.722 176.278 145.667 176.333z"/>
<path style="fill:#eecec4; stroke:none;" d="M43 177L44 178L43 177z"/>
<path style="fill:#9e7263; stroke:none;" d="M56 177L57 178L56 177z"/>
<path style="fill:#d5b6ac; stroke:none;" d="M57 177L58 178L57 177z"/>
<path style="fill:#ad8975; stroke:none;" d="M60.3333 178.667C60.2778 178.722 60.2222 179.778 60.6667 179.333C60.7222 179.278 60.7778 178.222 60.3333 178.667z"/>
<path style="fill:#c2a390; stroke:none;" d="M45 180L46 181L45 180z"/>
<path style="fill:#ecd4ce; stroke:none;" d="M60.3333 180.667C60.2778 180.722 60.2222 181.778 60.6667 181.333C60.7222 181.278 60.7778 180.222 60.3333 180.667z"/>
<path style="fill:#d6aba0; stroke:none;" d="M46 181L47 182L46 181z"/>
<path style="fill:#ac7b60; stroke:none;" d="M49 183L50 184L49 183z"/>
<path style="fill:#bb8870; stroke:none;" d="M59 184L60 185L59 184z"/>
<path style="fill:#b6856d; stroke:none;" d="M53 185L54 186L53 185z"/>
<path style="fill:#ffe2cb; stroke:none;" d="M59.3333 185.667C59.2778 185.722 59.2222 186.778 59.6667 186.333C59.7222 186.278 59.7778 185.222 59.3333 185.667z"/>
<path style="fill:#917965; stroke:none;" d="M56 186L57 187L56 186z"/>
</svg>

);

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="min-h-screen bg-amber-50">
        {/* Header Responsive */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
              <div className="flex items-center gap-3">
                <Logo />
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#8B4513]">COCO LAB</h1>
                  <p className="text-sm text-[#A0522D]">Gestionale Laboratorio</p>
                </div>
              </div>
              {session && (
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <span className="text-[#8B4513] text-sm md:text-base text-center">
                    {session.user.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full md:w-auto px-4 py-2 text-[#8B4513] hover:bg-amber-50 rounded-lg flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Esci
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Responsive */}
        <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Menu Cards */}
            <Link 
              href="/orders" 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100 text-center flex flex-col items-center"
            >
              <ShoppingCart className="h-10 w-10 md:h-12 md:w-12 text-[#8B4513] mb-3 md:mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-[#8B4513]">Nuovo Ordine</h2>
            </Link>

            <Link 
              href="/agenda" 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100 text-center flex flex-col items-center"
            >
              <Calendar className="h-10 w-10 md:h-12 md:w-12 text-[#8B4513] mb-3 md:mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-[#8B4513]">Agenda Ordini</h2>
            </Link>

            <Link 
              href="/recipes" 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100 text-center flex flex-col items-center"
            >
              <Book className="h-10 w-10 md:h-12 md:w-12 text-[#8B4513] mb-3 md:mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-[#8B4513]">Ricette</h2>
            </Link>

            <Link 
              href="/invoices" 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100 text-center flex flex-col items-center"
            >
              <FileText className="h-10 w-10 md:h-12 md:w-12 text-[#8B4513] mb-3 md:mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-[#8B4513]">Fatture</h2>
            </Link>
          </div>
        </main>

        {/* Footer Responsive */}
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <p className="text-center text-sm md:text-base text-[#A0522D]">
              © 2024 COCO LAB - Gestionale Laboratorio
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}