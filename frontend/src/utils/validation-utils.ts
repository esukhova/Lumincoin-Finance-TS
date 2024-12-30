export class ValidationUtils {

   public static validateNewCategory(newCategory: HTMLInputElement, existingCategories: string[]) {
        if (newCategory.value && (!existingCategories.includes(newCategory.value.toLowerCase()))) {
            newCategory.classList.remove('is-invalid');
            return true;
        } else {
            newCategory.classList.add('is-invalid');
            return false;
        }
    }
}