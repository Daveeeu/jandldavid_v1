<?php

namespace App\Support;

class ProjectAssistant
{
    private const QUESTIONS = [
        'Milyen célközönségnek készülne a rendszer?',
        'Melyek a legfontosabb funkciók, amelyeket a platformnak biztosítania kell?',
        'Szükséges-e felhasználói hitelesítés, online fizetés vagy előfizetéses modell?',
        'Van-e konkrét határidő a projekt elindítására, vagy rugalmas az ütemezés?',
    ];

    public function reply(array $messages, array $project): array
    {
        $userMessages = array_values(array_filter($messages, fn (array $message) => ($message['role'] ?? null) === 'user'));
        $questionIndex = count($userMessages) - 1;

        if ($questionIndex < count(self::QUESTIONS)) {
            return [
                'content' => self::QUESTIONS[$questionIndex],
                'type' => 'message',
            ];
        }

        $featureMessage = $userMessages[2]['content'] ?? '';
        $features = array_values(array_filter(array_map('trim', preg_split('/[,;]+/', $featureMessage ?: '') ?: [])));

        return [
            'content' => 'Köszönöm a részletes válaszokat! Összeállítottam a projekt összefoglalóját.',
            'type' => 'project_summary',
            'summaryData' => [
                'goal' => $project['description'] ?: ($userMessages[0]['content'] ?? '–'),
                'audience' => $userMessages[1]['content'] ?? '–',
                'features' => $features !== [] ? $features : ['–'],
                'existingSystem' => ($project['existingSystem'] ?? false)
                    ? 'Igen'.(! empty($project['existingSystemUrl']) ? ' — '.$project['existingSystemUrl'] : '')
                    : 'Nem',
                'technical' => 'Webalapú platform, mobilbarát felület',
                'integrations' => 'Nincs meghatározva',
                'deadline' => $userMessages[3]['content'] ?? 'Rugalmas',
                'notes' => ($project['consultation'] ?? false) ? 'Online konzultáció kért' : '',
            ],
        ];
    }
}
