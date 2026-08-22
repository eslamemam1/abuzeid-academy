import { Component } from '@angular/core';

interface Concept {
  en: string;
  ar: string;
  text: string;
}

@Component({
  selector: 'app-basics',
  templateUrl: './basics.html',
})
export class Basics {
  protected readonly concepts: Concept[] = [
    { en: 'Variable', ar: 'متغير', text: 'علبة بتخزّن قيمة تقدر تغيّرها أو تجيبها وقت ما تحتاج.' },
    { en: 'Function', ar: 'دالة', text: 'مجموعة أوامر تحت اسم واحد، بتنفّذها كل مرة تحتاج نفس الشغل.' },
    { en: 'Loop', ar: 'حلقة', text: 'تكرار تنفيذ كود أكتر من مرة طالما شرط معيّن متحقق.' },
    { en: 'Array', ar: 'مصفوفة', text: 'قائمة بتخزّن أكتر من قيمة بترتيب ورقم لكل عنصر.' },
    { en: 'Boolean', ar: 'منطقي', text: 'قيمة إما صح أو خطأ، وأساس أي قرار جوه الكود.' },
    { en: 'String', ar: 'نص', text: 'سلسلة حروف وأرقام جوه علامات تنصيص.' },
    { en: 'Integer', ar: 'عدد صحيح', text: 'رقم من غير كسور، زي 1 و 42 و -7.' },
    { en: 'Condition', ar: 'شرط', text: 'تعبير منطقي بيتحدد بيه الكود يتنفّذ ولا لأ.' },
    { en: 'Algorithm', ar: 'خوارزمية', text: 'خطوات مرتبة ومحددة لحل مسألة أو تنفيذ مهمة.' },
    { en: 'Bug', ar: 'خطأ برمجي', text: 'مشكلة في الكود بتطلع خطأ أو سلوك مش متوقع.' },
    { en: 'Syntax', ar: 'صيغة', text: 'قواعد كتابة اللغة صح عشان الكمبيوتر يفهمها.' },
    { en: 'AI', ar: 'ذكاء اصطناعي', text: 'أنظمة بتحاكي الذكاء البشري وتتعلم من البيانات.' },
  ];
}
