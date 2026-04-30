
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface GoalSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (goals: string[]) => void;
    isLoading: boolean;
}

const predefinedGoals = [
    "Increase Brand Awareness",
    "Improve Customer Trust & Loyalty",
    "Reposition Brand",
    "Enter a New Market",
    "Differentiate from Competitors",
    "Justify a Price Increase",
    "Strengthen Emotional Connection"
];

export default function GoalSelectionModal({ isOpen, onClose, onConfirm, isLoading }: GoalSelectionModalProps) {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [customGoals, setCustomGoals] = useState<string[]>([]);
    const [customGoalInput, setCustomGoalInput] = useState('');

    const handleCheckboxChange = (goal: string, checked: boolean | 'indeterminate') => {
        if (typeof checked === 'boolean') {
            setSelectedGoals(prev => 
                checked ? [...prev, goal] : prev.filter(g => g !== goal)
            );
        }
    };

    const handleAddCustomGoal = () => {
        if (customGoalInput.trim() && !customGoals.includes(customGoalInput.trim())) {
            setCustomGoals(prev => [...prev, customGoalInput.trim()]);
            setCustomGoalInput('');
        }
    };

    const handleRemoveCustomGoal = (goalToRemove: string) => {
        setCustomGoals(prev => prev.filter(g => g !== goalToRemove));
    };

    const handleConfirm = () => {
        const allGoals = [...selectedGoals, ...customGoals];
        if (allGoals.length === 0) {
            // Add a default goal if none are selected
            onConfirm(["Provide a general brand analysis"]);
        } else {
            onConfirm(allGoals);
        }
    };
    
    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Set Your Analysis Goals</DialogTitle>
                    <DialogDescription>
                        Select your strategic goals to help the AI tailor the analysis. You can skip this for a general analysis.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <h4 className="font-semibold text-foreground">Predefined Goals</h4>
                    <ScrollArea className="h-48 rounded-md border p-4">
                        <div className="space-y-3">
                            {predefinedGoals.map(goal => (
                                <div key={goal} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={goal}
                                        checked={selectedGoals.includes(goal)}
                                        onCheckedChange={(checked) => handleCheckboxChange(goal, checked)}
                                    />
                                    <Label htmlFor={goal} className="font-normal cursor-pointer">{goal}</Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    
                    <h4 className="font-semibold text-foreground">Custom Goals</h4>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g., 'Launch a sub-brand'"
                            value={customGoalInput}
                            onChange={(e) => setCustomGoalInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomGoal()}
                        />
                        <Button variant="outline" size="icon" onClick={handleAddCustomGoal} aria-label="Add custom goal">
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </div>
                    {customGoals.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {customGoals.map(goal => (
                                <div key={goal} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                                    <span>{goal}</span>
                                    <button onClick={() => handleRemoveCustomGoal(goal)} className="text-secondary-foreground/70 hover:text-secondary-foreground">
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : "Confirm Goals & Analyze"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
