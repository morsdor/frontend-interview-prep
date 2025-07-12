# Dynamic Form Builder Component - Senior UI Developer Interview

## Problem Statement
Design a **Dynamic Form Builder** component that can render forms from JSON schema configurations, handle complex validation, conditional fields, and provide a great user experience for enterprise applications.

---

## Component Design & Architecture

### Core Types & Interfaces

```typescript
// types/form.ts
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  dependsOn?: string;
  showWhen?: ConditionalRule;
  gridColumn?: number;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
  validator?: (value: any) => boolean;
}

export interface ConditionalRule {
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater' | 'less';
  value: any;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitUrl?: string;
  autoSave?: boolean;
  multiStep?: boolean;
  steps?: FormStep[];
}

export interface FormStep {
  id: string;
  title: string;
  fields: string[];
  validation?: 'immediate' | 'onNext' | 'onSubmit';
}
```

### Main Form Builder Component

```typescript
// components/FormBuilder.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FormSchema, FormField, ValidationError } from '../types/form';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAutoSave } from '../hooks/useAutoSave';

interface FormBuilderProps {
  schema: FormSchema;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: Record<string, any>) => void;
  className?: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  schema,
  initialData = {},
  onSubmit,
  onValidationChange,
  onDataChange,
  className
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { errors, validateField, validateForm, isValid } = useFormValidation(schema, formData);
  const { isSaving, lastSaved } = useAutoSave(formData, schema.autoSave);

  // Memoized visible fields based on conditions
  const visibleFields = useMemo(() => {
    return schema.fields.filter(field => {
      if (!field.showWhen) return true;
      
      const dependentValue = formData[field.showWhen.field];
      const { operator, value } = field.showWhen;
      
      switch (operator) {
        case 'equals': return dependentValue === value;
        case 'not-equals': return dependentValue !== value;
        case 'contains': return Array.isArray(dependentValue) ? dependentValue.includes(value) : false;
        case 'greater': return Number(dependentValue) > Number(value);
        case 'less': return Number(dependentValue) < Number(value);
        default: return true;
      }
    });
  }, [schema.fields, formData]);

  const currentStepFields = useMemo(() => {
    if (!schema.multiStep || !schema.steps) return visibleFields;
    const step = schema.steps[currentStep];
    return visibleFields.filter(field => step.fields.includes(field.id));
  }, [schema.multiStep, schema.steps, currentStep, visibleFields]);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldId]: value };
      validateField(fieldId, value);
      onDataChange?.(newData);
      return newData;
    });
  }, [validateField, onDataChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (schema.multiStep && currentStep < (schema.steps?.length || 0) - 1) {
      const stepValid = validateStepFields();
      if (stepValid) setCurrentStep(prev => prev + 1);
      return;
    }

    const formValid = validateForm();
    if (!formValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStepFields = (): boolean => {
    const stepFieldIds = schema.steps?.[currentStep]?.fields || [];
    return stepFieldIds.every(fieldId => {
      const field = schema.fields.find(f => f.id === fieldId);
      return field ? validateField(fieldId, formData[fieldId]) : true;
    });
  };

  return (
    <div className={`form-builder ${className}`}>
      {schema.multiStep && (
        <ProgressIndicator 
          steps={schema.steps || []} 
          currentStep={currentStep}
        />
      )}
      
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-grid">
          {currentStepFields.map(field => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={formData[field.id]}
              error={errors[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          ))}
        </div>
        
        <div className="form-actions">
          {schema.multiStep && currentStep > 0 && (
            <button type="button" onClick={() => setCurrentStep(prev => prev - 1)}>
              Previous
            </button>
          )}
          
          <button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? 'Submitting...' : 
             schema.multiStep && currentStep < (schema.steps?.length || 0) - 1 ? 'Next' : 'Submit'}
          </button>
        </div>
        
        {submitError && <div className="error-message">{submitError}</div>}
        {schema.autoSave && <div className="auto-save-status">
          {isSaving ? 'Saving...' : lastSaved ? `Last saved: ${lastSaved}` : ''}
        </div>}
      </form>
    </div>
  );
};
```

### Field Renderer Component

```typescript
// components/FieldRenderer.tsx
import React from 'react';
import { FormField } from '../types/form';

interface FieldRendererProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, error, onChange }) => {
  const baseProps = {
    id: field.id,
    name: field.id,
    placeholder: field.placeholder,
    disabled: field.disabled,
    'aria-describedby': error ? `${field.id}-error` : undefined,
    'aria-invalid': !!error,
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            {...baseProps}
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`form-input ${error ? 'error' : ''}`}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            {...baseProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`form-textarea ${error ? 'error' : ''}`}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <select
            {...baseProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`form-select ${error ? 'error' : ''}`}
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            {...baseProps}
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="form-checkbox"
          />
        );
      
      case 'radio':
        return (
          <div className="radio-group">
            {field.options?.map(option => (
              <label key={option.value} className="radio-label">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="form-radio"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      
      case 'file':
        return (
          <input
            {...baseProps}
            type="file"
            onChange={(e) => onChange(e.target.files?.[0])}
            className={`form-file ${error ? 'error' : ''}`}
          />
        );
      
      case 'date':
        return (
          <input
            {...baseProps}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`form-input ${error ? 'error' : ''}`}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`field-wrapper ${field.gridColumn ? `col-${field.gridColumn}` : ''}`}>
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <div id={`${field.id}-error`} className="field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
```

### Custom Hooks

```typescript
// hooks/useFormValidation.ts
import { useState, useCallback } from 'react';
import { FormSchema, ValidationRule } from '../types/form';

export const useFormValidation = (schema: FormSchema, formData: Record<string, any>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((fieldId: string, value: any): boolean => {
    const field = schema.fields.find(f => f.id === fieldId);
    if (!field) return true;

    const fieldErrors: string[] = [];

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      fieldErrors.push(`${field.label} is required`);
    }

    // Custom validation rules
    if (field.validation && value) {
      field.validation.forEach(rule => {
        switch (rule.type) {
          case 'minLength':
            if (typeof value === 'string' && value.length < (rule.value as number)) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'maxLength':
            if (typeof value === 'string' && value.length > (rule.value as number)) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'pattern':
            if (typeof value === 'string' && !new RegExp(rule.value as string).test(value)) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'custom':
            if (rule.validator && !rule.validator(value)) {
              fieldErrors.push(rule.message);
            }
            break;
        }
      });
    }

    setErrors(prev => ({
      ...prev,
      [fieldId]: fieldErrors.length > 0 ? fieldErrors[0] : ''
    }));

    return fieldErrors.length === 0;
  }, [schema.fields]);

  const validateForm = useCallback(): boolean => {
    let isValid = true;
    schema.fields.forEach(field => {
      if (!validateField(field.id, formData[field.id])) {
        isValid = false;
      }
    });
    return isValid;
  }, [schema.fields, formData, validateField]);

  const isValid = Object.values(errors).every(error => !error);

  return { errors, validateField, validateForm, isValid };
};

// hooks/useAutoSave.ts
import { useEffect, useState, useRef } from 'react';

export const useAutoSave = (data: Record<string, any>, enabled?: boolean) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLastSaved(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled]);

  return { isSaving, lastSaved };
};
```

### CSS Styles

```css
/* styles/FormBuilder.css */
.form-builder {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-wrapper.col-2 {
  grid-column: span 2;
}

.field-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #ef4444;
}

.field-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.form-actions button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form-actions button[type="submit"] {
  background-color: #3b82f6;
  color: white;
}

.form-actions button[type="submit"]:hover:not(:disabled) {
  background-color: #2563eb;
}

.form-actions button[type="submit"]:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.auto-save-status {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
  margin-top: 8px;
}

.error-message {
  color: #ef4444;
  padding: 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  margin-top: 16px;
}
```

---

## Interview Questions & Answers

### Q1: How would you handle form state management in a complex form with 50+ fields?

**Answer:**
I would implement a hierarchical state management approach:

1. **State Structure**: Use a flat object structure for form data to avoid deep nesting issues
2. **Immutable Updates**: Use immer or careful spread operators to ensure immutability
3. **Field-level State**: Store metadata separately (touched, pristine, etc.)
4. **Debounced Updates**: Implement debouncing for expensive operations like validation
5. **Memory Optimization**: Use React.memo for field components to prevent unnecessary re-renders

```typescript
const formState = {
  data: { field1: 'value1', field2: 'value2' }, // Flat structure
  meta: { 
    field1: { touched: true, pristine: false },
    field2: { touched: false, pristine: true }
  },
  errors: { field1: 'Error message' }
};
```

### Q2: How would you implement conditional field visibility with complex dependencies?

**Answer:**
I would create a dependency graph and evaluation engine:

1. **Dependency Mapping**: Build a map of field dependencies during initialization
2. **Evaluation Engine**: Create a rule evaluator that can handle complex boolean logic
3. **Reactive Updates**: Use useEffect to watch for changes in dependent fields
4. **Performance**: Memoize visibility calculations to avoid re-computation

```typescript
const evaluateCondition = (rule: ConditionalRule, formData: Record<string, any>): boolean => {
  const fieldValue = formData[rule.field];
  
  switch (rule.operator) {
    case 'and':
      return rule.conditions.every(condition => evaluateCondition(condition, formData));
    case 'or':
      return rule.conditions.some(condition => evaluateCondition(condition, formData));
    default:
      return simpleEvaluate(rule, fieldValue);
  }
};
```

### Q3: How would you handle file uploads with progress tracking and validation?

**Answer:**
I would implement a comprehensive file upload system:

1. **Upload Component**: Create a dedicated file upload component with drag-and-drop
2. **Progress Tracking**: Use XMLHttpRequest or fetch with progress events
3. **Validation**: Client-side validation for file type, size, and custom rules
4. **Queue Management**: Handle multiple file uploads with a queue system
5. **Error Handling**: Robust error handling with retry mechanisms

```typescript
const useFileUpload = (onProgress: (progress: number) => void) => {
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      };
      
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(new Error('Upload failed'));
      
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };
  
  return { uploadFile };
};
```

### Q4: How would you implement real-time validation without impacting performance?

**Answer:**
I would use a multi-layered validation approach:

1. **Debounced Validation**: Debounce validation calls to avoid excessive API calls
2. **Client-side First**: Perform client-side validation immediately
3. **Server-side Async**: Use async validation for database checks
4. **Validation Cache**: Cache validation results to avoid duplicate checks
5. **Progressive Validation**: Validate fields as users interact with them

```typescript
const useDebouncedValidation = (validator: Function, delay: number = 300) => {
  const [isValidating, setIsValidating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedValidate = useCallback((value: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsValidating(true);
    timeoutRef.current = setTimeout(async () => {
      await validator(value);
      setIsValidating(false);
    }, delay);
  }, [validator, delay]);
  
  return { debouncedValidate, isValidating };
};
```

### Q5: How would you handle form accessibility (a11y) requirements?

**Answer:**
I would implement comprehensive accessibility features:

1. **ARIA Labels**: Proper labeling with aria-label and aria-describedby
2. **Error Announcements**: Use aria-live regions for dynamic error messages
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Proper focus management between steps and errors
5. **Screen Reader Support**: Semantic HTML and proper ARIA attributes

```typescript
const AccessibleField = ({ field, error }: { field: FormField; error?: string }) => {
  const errorId = `${field.id}-error`;
  
  return (
    <div className="field-wrapper">
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.required && <span aria-label="required">*</span>}
      </label>
      
      <input
        id={field.id}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        aria-required={field.required}
      />
      
      {error && (
        <div id={errorId} role="alert" className="field-error">
          {error}
        </div>
      )}
    </div>
  );
};
```

### Q6: How would you handle multi-step forms with complex validation rules?

**Answer:**
I would implement a state machine approach:

1. **Step State Machine**: Define clear states and transitions between steps
2. **Validation Strategies**: Different validation approaches per step (immediate, on-next, on-submit)
3. **Data Persistence**: Save progress between steps with auto-save
4. **Navigation Rules**: Prevent forward navigation until current step is valid
5. **Progress Tracking**: Clear visual indication of progress and completion

```typescript
const useMultiStepForm = (steps: FormStep[]) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});
  
  const canProceed = (stepIndex: number): boolean => {
    return stepValidation[stepIndex] ?? false;
  };
  
  const goToNext = () => {
    if (canProceed(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  return { currentStep, goToNext, goToPrevious, canProceed };
};
```

### Q7: How would you optimize the component for large-scale applications?

**Answer:**
I would implement several optimization strategies:

1. **Code Splitting**: Lazy load field components and validation libraries
2. **Virtual Scrolling**: For forms with many fields, implement virtual scrolling
3. **Memoization**: Use React.memo and useMemo extensively
4. **Bundle Optimization**: Tree-shake unused field types and validators
5. **Caching**: Cache form schemas and validation results

```typescript
// Lazy loading field components
const FieldComponents = {
  text: lazy(() => import('./fields/TextField')),
  select: lazy(() => import('./fields/SelectField')),
  file: lazy(() => import('./fields/FileField')),
};

const LazyField = ({ field, ...props }) => {
  const Component = FieldComponents[field.type];
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component field={field} {...props} />
    </Suspense>
  );
};
```

### Q8: How would you implement form data persistence and recovery?

**Answer:**
I would create a comprehensive persistence system:

1. **Auto-save**: Automatically save form data to localStorage/sessionStorage
2. **Recovery UI**: Show recovery options when returning to incomplete forms
3. **Conflict Resolution**: Handle conflicts between saved and new data
4. **Cleanup**: Clean up stale saved data
5. **Encryption**: Encrypt sensitive data before storage

```typescript
const useFormPersistence = (formId: string) => {
  const saveData = useCallback((data: Record<string, any>) => {
    const storageKey = `form_${formId}`;
    const persistData = {
      data,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    localStorage.setItem(storageKey, JSON.stringify(persistData));
  }, [formId]);
  
  const loadData = useCallback(() => {
    const storageKey = `form_${formId}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if data is not too old (e.g., 7 days)
      const isRecent = Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000;
      return isRecent ? parsed.data : null;
    }
    
    return null;
  }, [formId]);
  
  return { saveData, loadData };
};
```

### Q9: How would you test this component comprehensively?

**Answer:**
I would implement a comprehensive testing strategy:

1. **Unit Tests**: Test individual functions and hooks with Jest
2. **Integration Tests**: Test component interactions with React Testing Library
3. **E2E Tests**: Test complete user workflows with Cypress/Playwright
4. **Visual Tests**: Screenshot testing for UI consistency
5. **Performance Tests**: Load testing with large forms

```typescript
// Example test
describe('FormBuilder', () => {
  it('should validate required fields', async () => {
    const schema = {
      fields: [
        { id: 'email', type: 'email', label: 'Email', required: true }
      ]
    };
    
    render(<FormBuilder schema={schema} onSubmit={jest.fn()} />);
    
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });
  
  it('should handle conditional field visibility', () => {
    const schema = {
      fields: [
        { id: 'type', type: 'select', options: [{ value: 'personal', label: 'Personal' }] },
        { id: 'company', type: 'text', showWhen: { field: 'type', operator: 'equals', value: 'business' } }
      ]
    };
    
    render(<FormBuilder schema={schema} onSubmit={jest.fn()} />);
    
    expect(screen.queryByLabelText('Company')).not.toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'business' } });
    
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
  });
});
```

### Q10: How would you handle internationalization (i18n) in this form builder?

**Answer:**
I would implement a flexible i18n system:

1. **Schema Localization**: Support for localized field labels and messages
2. **Validation Messages**: Localized error messages
3. **Dynamic Loading**: Load translations based on user locale
4. **Formatting**: Handle locale-specific date/number formats
5. **RTL Support**: Support for right-to-left languages

```typescript
interface LocalizedFormField extends FormField {
  label: string | Record<string, string>;
  placeholder?: string | Record<string, string>;
  validation?: LocalizedValidationRule[];
}

interface LocalizedValidationRule extends ValidationRule {
  message: string | Record<string, string>;
}

const useLocalization = (locale: string) => {
  const t = useCallback((text: string | Record<string, string>): string => {
    if (typeof text === 'string') return text;
    return text[locale] || text['en'] || Object.values(text)[0];
  }, [locale]);
  
  return { t };
};
```